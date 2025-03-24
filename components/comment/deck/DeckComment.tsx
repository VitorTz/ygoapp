import { View, Pressable, ActivityIndicator, Text, StyleSheet } from "react-native"
import { AppConstants } from "@/constants/AppConstants"
import { deleteDeckCommentVote } from "@/lib/supabase"
import { AppStyle } from "@/style/AppStyle"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { voteDeckComment } from "@/lib/supabase"
import { Image } from "expo-image"
import Toast from "@/components/Toast"
import { DeckComment } from "@/helpers/types"
import { Entypo } from "@expo/vector-icons"
import { useState } from "react"
import DeckCommentReply from "./DeckCommentReply"


interface DeckCommentProps {
    comment: DeckComment    
    user_id: string | null
    is_nested: boolean
    sendReply: (parent_comment_id: number, reply: string) => void
}


const DeckCommentComponent = ({comment, user_id, is_nested, sendReply}: DeckCommentProps) => {
    
    const originalNumVotes = comment.vote_sum
    const [showReplies, setShowReplies] = useState(true)
    const [numVotes, setNumVotes] = useState(comment.vote_sum)
    const [replyBoxIsOpened, setReplyBoxIsOpened] = useState(false)    
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

    const toggleShowReplies = () => {        
        if (is_nested) { return }
        setShowReplies(prev => !prev)
    }

    return (
        <>
            <Pressable onPress={toggleShowReplies} style={[styles.comment, {gap: 10}]} >
                <Image 
                    source={comment.user_image_url} 
                    style={{alignSelf: "flex-start", width: 64, height: 64, borderRadius: 64}} />
                <View >
                    <View>
                        <Text style={[AppStyle.textRegular, {color: Colors.accentColor, fontSize: 20}]}>{comment.user_name}</Text>
                        <Text style={AppStyle.textRegular} >{comment.comment}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20, gap: 20, alignItems: "center", justifyContent: "center"}} >
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

                                    <Text style={[AppStyle.textRegular, {fontSize: 16, color: Colors.white}]}>{numVotes}</Text>

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
                            <Pressable 
                                onPress={openReply} 
                                hitSlop={AppConstants.hitSlop} 
                                style={{flexDirection: 'row', gap: 10, alignItems: "center", justifyContent: "center"}} >
                                <Ionicons name='arrow-undo-outline' size={16} color={Colors.white} />
                                <Text style={AppStyle.textRegular} >Reply</Text>
                            </Pressable>
                        }
                    </View>

                </View>
            </Pressable>            
            <View style={{width: '100%', display: replyBoxIsOpened ? 'flex' : 'none'}} >
                <DeckCommentReply
                    sendReply={sendReply}
                    closeReply={closeReply} 
                    deck_id={comment.deck_id}
                    comment_id={comment.comment_id}/>
            </View>
            <View style={{flexDirection: 'row', alignItems: "center", display: showReplies ? 'flex' : 'none'}} >
                <View style={{width: 2, marginHorizontal: 20, height: '80%', backgroundColor: Colors.gray1}}/>
                <View style={{flex: 1}} >
                    {
                        comment.replies.map(item => {
                            return (
                                <DeckCommentComponent sendReply={sendReply} key={item.comment_id} comment={item} is_nested={true} user_id={user_id} />
                            )
                        })
                    }
                </View>
            </View>
        </>
    )
}

export default DeckCommentComponent;


const styles = StyleSheet.create({
    comment: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.gray1,        
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10
    }
})