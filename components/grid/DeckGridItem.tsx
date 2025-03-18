import { StyleSheet, Pressable, View, Text } from 'react-native'
import { Deck } from '@/helpers/types'
import { Keyboard } from 'react-native'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import React from 'react'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { AppConstants } from '@/constants/AppConstants'
import { Ionicons } from '@expo/vector-icons'


interface DeckCardProps {
    deck: Deck
    index: number
    columns: number
    width: number
    height: number    
    onDeckPress?: (deck: Deck) => void
}


const DeckGridItem = ({
    deck, 
    index, 
    columns, 
    width, 
    height, 
    onDeckPress
}: DeckCardProps) => {
    return (
        <Pressable onPress={() => onDeckPress ? onDeckPress(deck) : null} style={[styles.button, {marginTop: index >= columns ? 10 : 0}]}>
            <Image contentFit='cover' style={{width, height}} source={deck.image_url}/>
            <View style={[styles.container, {width: width}]} >
                <Text style={[AppStyle.textRegular, {color: Colors.white}]}>{deck.name}</Text>                
                <Text style={AppStyle.textRegular}>{deck.type}</Text>
                <Text style={AppStyle.textRegular}>{deck.num_cards} cards</Text>                
            </View>
        </Pressable>
    )
}

export default DeckGridItem

const styles = StyleSheet.create({
    container: {
        padding: 10, 
        backgroundColor: Colors.gray,         
        borderTopWidth: 4, 
        borderColor: Colors.deckColor,
        gap: 6,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
    },    
    button: {
        flex: 1,
        alignItems: "center"        
    }
})