import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { Colors } from '@/constants/Colors'
import React, { useContext, useState } from 'react'
import { supaAddDeckToCollection } from '@/lib/supabase'
import { Deck } from '@/helpers/types'
import { AppStyle } from '@/style/AppStyle'
import Toast from './Toast'
import { GlobalContext } from '@/helpers/context'
import { router } from 'expo-router'


const AddDeckToUserCollection = ({deck}: {deck: Deck}) => {
    
    const context = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)
    
    const userIsOwner = context.session != null && context.session.user.id == deck.created_by
    const txt = userIsOwner ? "Edit deck" : "Copy to collection"

    const addDeck = async () => {
        setLoading(true)
        await supaAddDeckToCollection(deck.deck_id)
            .then(success => {
                success ?
                    Toast.show({title: "Success", message: "Deck copied to your collection", type: "success"}) :
                    Toast.show({title: "Error", message: "Could not add to your collection", type: "error"})
                }                
            )        
        setLoading(false)
    }

    const onPress = userIsOwner ?
        () => router.navigate({pathname: "/editDeck", params: deck as any}) :
        addDeck


    return (        
        <Pressable onPress={onPress} style={styles.container} >
            {
                loading ? 
                <ActivityIndicator size={32} color={Colors.white} /> :
                <Text style={AppStyle.textRegular} >{txt}</Text>
            }
        </Pressable>
    )
}

export default AddDeckToUserCollection

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        height: 50, 
        backgroundColor: Colors.deckColor, 
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center"
    }
})