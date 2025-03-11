import { StyleSheet, Pressable, View, Text } from 'react-native'
import { Deck } from '@/helpers/types'
import { Keyboard } from 'react-native'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import React from 'react'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'


interface DeckCardProps {
    deck: Deck
    index: number
    columns: number
    width: number
    height: number
}


const DeckCard = ({deck, index, columns, width, height}: DeckCardProps) => {    
    
    const handlePress = () => {
        Keyboard.dismiss()            
        // router.push({pathname: "/(pages)/deckPage", params: deck})
    }

    return (        
        <Pressable onPress={() => handlePress()} style={[styles.button, {marginTop: index >= columns ? 10 : 0}]}>
            <Image contentFit='cover'  style={{width, height}} source={deck.image_url}/>
            <View style={[styles.container, {width: width}]} >
                <Text style={[AppStyle.textRegular, {color: Colors.orange}]}>{deck.name}</Text>
                <Text style={AppStyle.textRegular}>{deck.type}</Text>
                <Text style={AppStyle.textRegular}>{deck.num_cards} cards</Text>                
            </View>
        </Pressable>
    )
}

export default DeckCard

const styles = StyleSheet.create({
    container: {
        padding: 10, 
        backgroundColor: Colors.gray, 
        paddingVertical: 20,         
        borderTopWidth: 4, 
        borderColor: Colors.orange
    },    
    button: {
        flex: 1,
        alignItems: "center"        
    }
})