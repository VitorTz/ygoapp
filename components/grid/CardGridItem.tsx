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
}


const CardGridItem = ({card, index, width, height, columns}: CardComponentProps) => {
    
    const handlePress = () => {
        Keyboard.dismiss()
        router.navigate({pathname: "/(pages)/cardPage", params: card})
    }
    
    return (
        <Pressable onPress={handlePress}>
            <Image style={{width, height, marginTop: index >= columns ? 10 : 0}} source={card.image_url} />
        </Pressable>
    )
}

export default CardGridItem

const styles = StyleSheet.create({})