import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { Colors } from '@/constants/Colors'
import React, { useState } from 'react'
import { supaAddDeckToCollection } from '@/lib/supabase'
import { AppStyle } from '@/style/AppStyle'
import { showToast } from '@/helpers/util'


const AddDeckToUserCollection = ({deck_id}: {deck_id: number}) => {
    const [loading, setLoading] = useState(false)            

    const addDeck = async () => {
        setLoading(true)
        const success= await supaAddDeckToCollection(deck_id)
        if (success) {
            showToast("Success!", "Deck copied to your collection", "success")
        } else {
            showToast("Error!", "Could not add to your collection", "error")
        }
        setLoading(false)
    }    

    return (
        <Pressable onPress={addDeck} style={styles.container} >
            {
                loading ? 
                <ActivityIndicator size={32} color={Colors.white} /> :
                <Text style={AppStyle.textRegular} >copy deck to collection</Text>
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