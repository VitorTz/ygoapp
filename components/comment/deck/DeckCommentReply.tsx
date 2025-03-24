import { TextInput, View, Pressable, ActivityIndicator, StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { hp } from "@/helpers/util"
import { useState, useRef } from "react"
import { removeTrailingNewlines } from "@/helpers/util"
import { replyToDeckComment } from "@/lib/supabase"
import Toast from "@/components/Toast"

interface CommentReplyProps {
    comment_id: number,
    sendReply: (parent_comment_id: number, reply: string) => void
    closeReply: () => void
    deck_id: number
}

const DeckCommentReply = ({comment_id, closeReply, sendReply, deck_id}: CommentReplyProps) => {
    
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<TextInput>(null)

    const close = () => {
        inputRef.current?.clear()
        closeReply()
    }

    const onPress = async () => {
        setLoading(true)
        await sendReply(comment_id, text)
        setLoading(false)
        closeReply()
    }
    

    return (
        <View style={{width: '100%', marginBottom: 10, gap: 10}} >
            <TextInput
                ref={inputRef}
                style={[styles.input, {height: hp(14)}]}
                placeholder='type something...'
                maxLength={400}
                placeholderTextColor={Colors.white}
                multiline={true}
                onChangeText={t => setText(t)}
            />
            <View style={{flexDirection: 'row', gap: 10, alignSelf: "flex-end", alignItems: "center", justifyContent: "center"}} >
                <Pressable onPress={close} style={{padding: 6, backgroundColor: Colors.gray, borderRadius: 4}} >
                    <Ionicons name='close-circle' size={22} color={Colors.white}/>
                </Pressable>
                <Pressable onPress={onPress} style={{padding: 6, backgroundColor: Colors.gray, borderRadius: 4}}>
                    {
                        loading ?
                        <ActivityIndicator size={22} color={Colors.white} /> :
                        <Ionicons name='send' size={22} color={Colors.white}/>
                    }
                </Pressable>
            </View>
        </View>
    )
}


export default DeckCommentReply;


const styles = StyleSheet.create({
    input: {
        width: '100%', 
        color: Colors.white, 
        paddingHorizontal: 10, 
        height: hp(10), 
        backgroundColor: Colors.gray, 
        borderRadius: 4, 
        textAlignVertical: "top"
    }
})