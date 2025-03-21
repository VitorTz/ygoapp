import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppStyle } from '@/style/AppStyle'
import { debounce } from 'lodash';
import { useCallback } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { wp, hp, removeTrailingNewlines } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import { Deck, DeckComment } from '@/helpers/types'
import { createDeckComment, deleteDeckCommentVote, fetchDeckComments, replyToDeckComment, voteDeckComment } from '@/lib/supabase'
import { FlashList } from '@shopify/flash-list'
import { Ionicons } from '@expo/vector-icons'
import { AppConstants } from '@/constants/AppConstants'
import Toast from './Toast'
import { Image } from 'expo-image'
import { GlobalContext } from '@/helpers/context'


interface DeckCommentsProps {
    deck: Deck
}


const height = hp(10)

interface CommentReplyProps {
    comment_id: number,    
    user_id: string
    closeReply: () => void
    deck_id: number
}

const CommentReply = ({comment_id, user_id, closeReply, deck_id}: CommentReplyProps) => {
    
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<TextInput>(null)

    const close = () => {
        inputRef.current?.clear()
        closeReply()
    }

    const sendReply = async () => {
        const t = removeTrailingNewlines(text)        
        if (t.length <= 3) {
            Toast.show({title: "Warning", message: "Comments must be at least 3 characters", type: "info"})
            return
        }
        setLoading(true)
        await replyToDeckComment(
            comment_id,
            deck_id,
            user_id,
            text
        )
        close()
        setLoading(false)
    }

    return (
        <View style={{width: '100%', marginBottom: 10, gap: 10}} >
            <TextInput
                ref={inputRef}
                style={[styles.input, {height: hp(20)}]}
                placeholder='type something...'
                maxLength={400}
                placeholderTextColor={Colors.white}
                multiline={true}
                onChangeText={t => setText(t)}
            />
            <View style={{flexDirection: 'row', gap: 10, alignSelf: "flex-end", alignItems: "center", justifyContent: "center"}} >
                <Pressable onPress={close} style={{padding: 6, backgroundColor: Colors.gray, borderRadius: 4}} >
                    <Ionicons name='close-circle' size={22} color={Colors.deckColor}/>
                </Pressable>
                <Pressable onPress={sendReply} style={{padding: 6, backgroundColor: Colors.gray, borderRadius: 4}}>
                    {
                        loading ?
                        <ActivityIndicator size={22} color={Colors.deckColor} /> :
                        <Ionicons name='send' size={22} color={Colors.deckColor}/>
                    }
                </Pressable>
            </View>
        </View>
    )
}

interface CommentProps {
    comment: DeckComment    
    user_id: string | null
    is_nested: boolean
}


const Comment = ({comment, user_id, is_nested}: CommentProps) => {
    
    const context = useContext(GlobalContext)
    const originalNumVotes = comment.vote_sum
    const [numVotes, setNumVotes] = useState(comment.vote_sum)
    const [replyBoxIsOpened, setReplyBoxIsOpened] = useState(false)
    const [replies, setReplies] = useState(comment.replies)
    const [loading, setLoading] = useState(false)

    const [userVoteType, setUserVoteType] = useState<'Up' | 'Down' | 'None'>(
        comment.user_vote_sum == 1 ? 
            'Up' : comment.user_vote_sum == -1 ? 
            'Down' : 'None'
    )

    const updateVote = async (vote_type: "Up" | "Down") => {
        if (user_id == null) {
            Toast.show({title: "You are not logged", message: '', type: 'error'})
            return
        }
            
        setLoading(true)

        if (vote_type == userVoteType) {            
            const delta = vote_type == 'Up' ? -1 : 1
            const success = await voteDeckComment(comment.comment_id, user_id, delta)
            if (success) {                
                setNumVotes(originalNumVotes)
                setUserVoteType('None')
            }
            await deleteDeckCommentVote(comment.comment_id, user_id)
            setLoading(false)
            return
        }
        const delta = vote_type == 'Up' ? 1 : -1
        const success = await voteDeckComment(comment.comment_id, user_id, delta)
        if (success) {            
            setNumVotes(originalNumVotes + delta)
            setUserVoteType(vote_type)
        }
        setLoading(false)
    }

    const openReply = () => {
        if (user_id == null) {
            Toast.show({title: "You are not logged!", message: '', type: "error"})
            return
        }
        setReplyBoxIsOpened(prev => !prev)
    }

    const closeReply = () => {
        setReplyBoxIsOpened(false)
    }

    const addReply = (text: string, reply_id: number) => {
        setReplies(prev => [...[{
            comment: text,
            comment_id: reply_id,
            user_image_url: context.user!.image.image_url,
            user_name: context.user!.name,
            parent_comment_id: comment.comment_id,
            user_vote_sum: 0,
            vote_sum: 0,
            user_id: user_id,
            deck_id: comment.deck_id
        } as any], ...prev])
    }

    return (
        <View>
            <View style={[styles.comment, {gap: 10}]} >
                <Image 
                    source={comment.user_image_url} 
                    style={{alignSelf: "flex-start", width: 64, height: 64, borderRadius: 64}} />
                <View >
                    <View>
                        <Text style={[AppStyle.textRegular, {color: Colors.accentColor, fontSize: 20}]}>{comment.user_name}</Text>
                        <Text style={AppStyle.textRegular} >{comment.comment}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20, gap: 20}} >
                        
                        <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 6,  borderRadius: 22}} >
                            {
                                loading ?
                                <ActivityIndicator size={16} color={Colors.accentColor} /> :
                                <>
                                    <Pressable
                                        onPress={() => updateVote('Up')} 
                                        hitSlop={{left: 4, right: 4, top: 4, bottom: 4}}>
                                        <Entypo name="arrow-long-up" size={16} color={userVoteType == 'Up' ? Colors.accentColor : Colors.white} />
                                    </Pressable>

                                    <Text style={[AppStyle.textRegular, {fontSize: 16, color: Colors.white}]}>Votes: {numVotes}</Text>

                                    <Pressable 
                                        onPress={() => updateVote('Down')} 
                                        hitSlop={{left: 4, right: 4, top: 4, bottom: 4}}>
                                        <Entypo name="arrow-long-down" size={16} color={userVoteType == 'Down' ? Colors.accentColor : Colors.white} />
                                    </Pressable>
                                </>
                            }                        
                        </View>
                        {
                            is_nested == false &&
                            <Pressable onPress={openReply} style={{flexDirection: 'row', gap: 10, alignItems: "center", justifyContent: "center", borderRadius: 22}} >
                                <Ionicons name='chatbubble-outline' size={16} color={Colors.white} />
                                <Text style={AppStyle.textRegular} >Reply</Text>
                            </Pressable>
                        }
                    </View>

                </View>
            </View>            
            <View style={{width: '100%', display: replyBoxIsOpened ? 'flex' : 'none'}} >
                <CommentReply 
                    closeReply={closeReply} 
                    deck_id={comment.deck_id}
                    comment_id={comment.comment_id} 
                    user_id={user_id as any}/>
            </View>
            <View style={{width: '100%', flexDirection: 'row', alignItems: "center" }} >
                <View style={{width: 2, marginHorizontal: 20, height: '80%', backgroundColor: Colors.deckColor}}/>
                <View style={{width: '100%'}} >
                    {
                        replies.map(item => {
                            return (
                                <Comment key={item.comment_id} comment={item} is_nested={true} user_id={user_id} />
                            )
                        })
                    }
                </View>
            </View>
        </View>
    )
}


function nestComments(comments: DeckComment[]): DeckComment[] {
    const commentMap: Map<number, DeckComment> = new Map();
    const nestedComments: DeckComment[] = [];
    
    comments.forEach(comment => {
        comment.replies = [];
        commentMap.set(comment.comment_id, comment);
    });
    
    comments.forEach(comment => {
        if (comment.parent_comment_id !== null) {
            const parent = commentMap.get(comment.parent_comment_id);
            if (parent) {
                parent.replies.push(comment);
            }
        } else {
            nestedComments.push(comment);
        }
    });

    return nestedComments;
}

const DeckComments = ({deck}: DeckCommentsProps) => {

    const context = useContext(GlobalContext)
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState<DeckComment[]>([])
    const inputRef = useRef<TextInput>(null)
    const user_id = context.session ? context.session.user.id : null

    const init = async () => {
        inputRef.current?.clear()
        await fetchDeckComments(
            deck.deck_id, 
            context.session ? context.session.user.id : null
        ).then(values => setComments([...nestComments(values)]))
    }

    const sendComment = async () => {
        const comment: string = removeTrailingNewlines(text)
        if (comment.length < 3) {
            Toast.show({title: "Comment must be at least 3 characters", message: '', type: "info"})
            return
        }
        if (context.session == null) {
            Toast.show({title: "Your are not logged", message: '', type: "error"})
            return
        }

        setLoading(true)
        await createDeckComment(deck.deck_id, comment)
            .then(
                comment_id => {
                    if (comment_id == null) { return }
                    setComments(prev => [...[{
                        comment,
                        comment_id,
                        user_image_url: context.user!.image.image_url,
                        user_name: context.user!.name,
                        parent_comment_id: null,
                        user_vote_sum: 0,
                        vote_sum: 0,
                        user_id: context.session!.user.id,
                        deck_id: deck.deck_id
                    } as any], ...prev])
                }
            )
        inputRef.current?.clear()
        setLoading(false)
    }

    useEffect(
        () => { init() },
        []
    )

    return (
        <View style={styles.container} >
            <Text style={[AppStyle.textHeader, {color: Colors.white}]} >Comments</Text>
            <View style={{width: '100%', gap: 10}} >
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder='add a comment'
                    placeholderTextColor={Colors.white}
                    multiline={true}
                    onChangeText={setText}
                />
                <View style={styles.button} >
                    {
                        loading ? 
                        <ActivityIndicator size={32} color={Colors.deckColor} /> :
                        <Pressable onPress={sendComment} hitSlop={AppConstants.hitSlop}>
                            <Ionicons name='send' size={28} color={Colors.deckColor} />
                        </Pressable>
                    }
                </View>
            </View>
            <View style={{width: '100%', height: hp(60)}} >
                <FlashList
                    data={comments}
                    nestedScrollEnabled={true}
                    keyExtractor={(item, index) => index.toString()}
                    estimatedItemSize={height}
                    renderItem={({item, index}) => <Comment user_id={user_id} comment={item} is_nested={false}/>}
                />
            </View>            
        </View>
    )
}

export default DeckComments

const styles = StyleSheet.create({
    container: {
        width: '100%',         
        gap: 20,
        borderRadius: 4
    },
    comment: {
        width: '100%',
        borderRadius: 4,
        backgroundColor: Colors.gray,
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10
    },
    input: {
        width: '100%', 
        color: Colors.white, 
        paddingHorizontal: 10, 
        height: hp(10), 
        backgroundColor: Colors.gray, 
        borderRadius: 4, 
        textAlignVertical: "top"
    },
    button: {
        padding: 8, 
        borderRadius: 4, 
        backgroundColor: Colors.gray, 
        alignSelf: "flex-end", 
        alignItems: "center", 
        justifyContent: "center"
    }
})