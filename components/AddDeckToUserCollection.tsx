import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { supaAddDeckToCollection, supabase, supaRmvDeckFromCollection } from '@/lib/supabase'
import { AppStyle } from '@/style/AppStyle'


const AddDeckToUserCollection = ({deck_id}: {deck_id: number}) => {
    const [loading, setLoading] = useState(false)
    const [userHasDeck, setUserHasDeck] = useState(false)
    const text = userHasDeck ? "rmv deck from collection" : "add to collection"

    const update = async () => {
        const {data, error} = await supabase.from("user_dekcs").select("deck_id").eq("deck_id", deck_id)
        setUserHasDeck(data != null)
    }

    const handleAdd = async () => {
        const success = await supaAddDeckToCollection(deck_id)
        if (success) {
            setUserHasDeck(true)
        }
    }

    const handleRmv = async () => {
        const success = await supaRmvDeckFromCollection(deck_id)
        if (success) {
            setUserHasDeck(false)
        }
    }

    const handlePress = async () => {
        setLoading(true)
        userHasDeck ? await handleRmv() : await handleAdd()
        setLoading(false)        
    }

    useFocusEffect(
        useCallback(() => {
            update()
        }, [])
    )
    

    return (
        <Pressable onPress={handlePress} style={styles.container} >
            {
                loading ? 
                <ActivityIndicator size={32} color={Colors.white} /> :
                <Text style={AppStyle.textRegular} >{text}</Text>
            }
        </Pressable>
    )
}

export default AddDeckToUserCollection

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        height: 50, 
        backgroundColor: Colors.orange, 
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center"
    }
})