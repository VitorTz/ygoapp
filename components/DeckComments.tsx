import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AppStyle } from '@/style/AppStyle'
import { wp, hp, removeTrailingNewlines } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import { Deck, DeckComment } from '@/helpers/types'
import { createDeckComment, fetchDeckComments } from '@/lib/supabase'
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


const Comment = ({comment}: {comment: DeckComment}) => {

    return (
        <View style={[styles.comment, {flexDirection: 'row', gap: 10, alignItems: "center"}]} >
            <Image source={comment.user_image_url} style={{alignSelf: "flex-start", width: 64, height: 64, borderRadius: 64}} />
            <View>
                <Text style={[AppStyle.textRegular, {color: Colors.accentColor, fontSize: 20}]}>{comment.username}</Text>
                <Text style={AppStyle.textRegular} >{comment.comment}</Text>
            </View>
        </View>
    )
}

const DeckComments = ({deck}: DeckCommentsProps) => {

    const context = useContext(GlobalContext)
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState<DeckComment[]>([])

    const init = async () => {
        await fetchDeckComments(deck.deck_id)
            .then(values => setComments(values))
    }

    const sendComment = async () => {
        const comment = removeTrailingNewlines(text)
        if (comment.length < 3) {
            Toast.show({title: "Warning", message: "Please, write a valid comment", type: "info"})
            return
        }
        setLoading(true)
        await createDeckComment(deck.deck_id, comment)
            .then(
                comment_id => {
                    if (comment_id == null) {
                        return
                    }
                    const newCommment: DeckComment = {
                        comment,
                        comment_id,
                        user_image_url: context.user!.image.image_url,
                        username: context.user!.name
                    }
                    setComments(prev => [...[newCommment], ...prev])
                    setText('')
                }
            )
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
                    style={styles.input}
                    placeholder='add a comment'
                    placeholderTextColor={Colors.white}
                    multiline={true}
                    value={text}
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
                    renderItem={({item, index}) => <Comment comment={item}/>}
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