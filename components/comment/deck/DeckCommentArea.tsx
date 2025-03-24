import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AppStyle } from '@/style/AppStyle'
import { wp, hp, removeTrailingNewlines } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import { Deck, DeckComment } from '@/helpers/types'
import { createDeckComment, fetchDeckComments, replyToDeckComment } from '@/lib/supabase'
import { FlashList } from '@shopify/flash-list'
import { nestComments } from '@/helpers/util';
import DeckCommentComponent from './DeckComment'
import Toast from '../../Toast'
import { GlobalContext } from '@/helpers/context'
import DeckCommentInput from './DeckCommentInput';


interface DeckCommentsProps {
    deck: Deck
}


const height = hp(10)

const DeckCommentArea = ({deck}: DeckCommentsProps) => {

    const context = useContext(GlobalContext)
    const [comments, setComments] = useState<DeckComment[]>([])
    const user_id = context.session ? context.session.user.id : null

    const init = async () => {        
        await fetchDeckComments(
            deck.deck_id, 
            context.session ? context.session.user.id : null
        ).then(values => setComments([...nestComments(values)]))
    }

    useEffect(
        () => { init() },
        []
    )

    const sendComment = async (comment: string) => {
        if (context.session == null) {
            Toast.show({title: "Your are not logged", message: '', type: "error"})
            return
        }
        comment = removeTrailingNewlines(comment)
        if (comment.length < 3) {
            Toast.show({title: "Comment must be at least 3 characters", message: '', type: "info"})
            return
        }        
        await createDeckComment(deck.deck_id, comment)
            .then(comment_id => {
                if (!comment_id) return
                
                const newComment: DeckComment = {
                    comment,
                    comment_id,
                    user_image_url: context.user!.image.image_url,
                    user_name: context.user!.name,
                    parent_comment_id: null,
                    user_vote_sum: 0,
                    vote_sum: 0,
                    user_id: context.session!.user.id,
                    deck_id: deck.deck_id,
                    replies: []
                };

                setComments([newComment, ...comments])
        })
    }

    const sendReply = async (parent_comment_id: number, reply: string) => {
        if (context.session == null) {
            Toast.show({title: "Your are not logged", message: '', type: "error"})
            return
        }
        reply = removeTrailingNewlines(reply)
        if (reply.length < 3) {
            Toast.show({title: "Reply must be at least 3 characters", message: '', type: "info"})
            return
        }
        
        await replyToDeckComment(parent_comment_id, deck.deck_id, context.session.user.id, reply)
            .then(
                comment_id => {
                    if (comment_id == null) return
                    const newReply: DeckComment = {
                        comment_id,
                        parent_comment_id,
                        comment: reply,
                        deck_id: deck.deck_id,
                        replies: [],
                        user_id: context.session!.user.id,
                        user_image_url: context.user!.image.image_url,
                        user_name: context.user!.name,
                        user_vote_sum: 0,
                        vote_sum: 0
                    }
                    setComments(prev => {
                        return prev.map(c => {c.comment_id == parent_comment_id ? c.replies = [newReply, ...c.replies] : null; return c})
                    })
                }
            )
    }    

    return (
        <View style={styles.container} >
            <Text style={[AppStyle.textHeader, {color: Colors.white}]} >Comments</Text>
            <DeckCommentInput sendComment={sendComment} />
            <View style={{width: '100%', height: hp(60)}} >
                <FlashList
                    data={comments}
                    nestedScrollEnabled={true}
                    keyExtractor={(item: DeckComment, index) => item.comment_id.toString()}
                    estimatedItemSize={height}
                    renderItem={({item, index}) => <DeckCommentComponent sendReply={sendReply} user_id={user_id} comment={item} is_nested={false}/>}
                />
            </View>            
        </View>
    )
}

export default DeckCommentArea

const styles = StyleSheet.create({
    container: {
        width: '100%',         
        gap: 20,
        borderRadius: 4
    }
})