import { View, Pressable, ActivityIndicator, Text, StyleSheet } from "react-native"
import { AppConstants } from "@/constants/AppConstants"
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
        
    const [showReplies, setShowReplies] = useState(true)
    const [numVotes, setNumVotes] = useState(comment.vote_sum)
    const [replyBoxIsOpened, setReplyBoxIsOpened] = useState(false)    
    const [loading, setLoading] = useState(false)
        
    const [userVoteType, setUserVoteType] = useState<'Up' | 'Down' | 'None'>(
        comment.user_vote_sum == 1 ? 
            'Up' : comment.user_vote_sum == -1 ? 
            'Down' : 'None'
    )

    const downVote = async () => {
        const delta = userVoteType == 'Down' ? 1 : -1
        const newVoteType = userVoteType == 'Down' ? 'None' : 'Down'
        await voteDeckComment(
            comment.comment_id,
            user_id!,
            delta
        ).then(success => {
            if (!success) return
            setNumVotes(numVotes + delta)
            setUserVoteType(newVoteType)
        })
    }

    const upVote = async () => {
        const delta = userVoteType == 'Up' ? -1 : 1
        const newVoteType = userVoteType == 'Up' ? 'None' : 'Up'
        await voteDeckComment(
            comment.comment_id,
            user_id!,
            delta
        ).then(success => {
            if (!success) return
            setNumVotes(numVotes + delta)
            setUserVoteType(newVoteType)
        })
    }

    const vote = async (type: "Up" | "Down") => {
        if (user_id == null) {
            Toast.show({title: "You are not logged", message: '', type: 'error'})
            return
        }
        setLoading(true)
        switch (type) {
            case "Up":
                await upVote()
                break
            case "Down":
                await downVote()
                break
            default:
                break
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
                                <ActivityIndicator size={16} color={Colors.white} /> :
                                <>
                                    <Pressable
                                        onPress={() => vote('Up')} 
                                        hitSlop={{left: 4, right: 4, top: 4, bottom: 4}}>
                                        <Entypo name="arrow-long-up" size={16} color={userVoteType == 'Up' ? Colors.accentColor : Colors.white} />
                                    </Pressable>

                                    <Text style={[AppStyle.textRegular, {fontSize: 16, color: Colors.white}]}>{numVotes}</Text>

                                    <Pressable 
                                        onPress={() => vote('Down')} 
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