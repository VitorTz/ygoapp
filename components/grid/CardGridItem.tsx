import { StyleSheet, Pressable, Keyboard, Text, View } from 'react-native'
import { Card } from '@/helpers/types'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import React from 'react'


interface CardComponentProps {
    card: Card
    index: number
    width: number
    height: number
    columns: number
    onCardPress?: (card: Card) => void
}


const CardGridItem = ({card, index, width, height, columns, onCardPress}: CardComponentProps) => {

    const p = onCardPress ? 
        onCardPress : 
        (card: Card) => router.navigate({pathname: "/(pages)/cardPage", params: card as any})
    
    const handlePress = async () => {
        Keyboard.dismiss()
        await p(card)
    }
    
    return (
        <Pressable onPress={handlePress}>
            <Image style={{width, height, marginTop: index >= columns ? 10 : 0}} source={card.image_url} />
        </Pressable>
    )
}

export default CardGridItem

const styles = StyleSheet.create({})