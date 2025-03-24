import { StyleSheet, TextInput, Pressable, ActivityIndicator, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { hp } from '@/helpers/util'
import { AppConstants } from '@/constants/AppConstants'
import { Colors } from '@/constants/Colors'
import { useState, useRef } from 'react'
import React from 'react'


interface CommentInputProps {
    sendComment: (comment: string) => void
}

const DeckCommentInput = ({sendComment}: CommentInputProps) => {
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState('')
    const inputRef = useRef<TextInput>(null)

    const send = async () => {
        setLoading(true)
        await sendComment(text)
        setLoading(false)
        inputRef.current?.clear()
    }

    return (
        <View style={{width: '100%', gap: 10}} >
            <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder='add a comment'
                placeholderTextColor={Colors.white}
                multiline={true}
                onChangeText={setText}/>
            <View style={styles.button} >
                {
                    loading ? 
                    <ActivityIndicator size={22} color={Colors.white} /> :
                    <Pressable onPress={send} hitSlop={AppConstants.hitSlop}>
                        <Ionicons name='send' size={22} color={Colors.white} />
                    </Pressable>
                }
            </View>
        </View>
    )
}

export default DeckCommentInput

const styles = StyleSheet.create({
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