import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import { Card } from '@/helpers/types'
import { hp, wp } from '@/helpers/util'
import { AppStyle } from '@/style/AppStyle'
import CardGrid from './grid/CardGrid'
import { router } from 'expo-router'


interface CardPoolProps {
    title?: string
    cards: Card[]
    onCardPress?: (card: Card) => void,
    showTotal?: boolean
    color?: string
    height?: number
}

const CardPool = ({
    title = "Cards",
    cards,
    onCardPress = (card: Card) => router.navigate({pathname: "/cardPage", params: card as any}),
    color = Colors.orange,
    height = hp(50),
    showTotal = true
}: CardPoolProps) => {    

    return (
        <View style={[styles.container, {borderColor: color, height}]} >
            <View style={[styles.header, {backgroundColor: color}]} >
                <Text style={[AppStyle.textRegular, {fontSize: hp(2.8)}]} >{title}</Text>
                {
                    showTotal &&
                    <Text style={[AppStyle.textRegular, {fontSize: hp(2.8)}]}>Total: {cards.length}</Text>
                }
            </View>
            <CardGrid
                cards={cards}
                hasResults={true}
                loading={false}
                numColumns={4}
                onCardPress={onCardPress}
                gap={20}/>
        </View>
    )
}

export default CardPool

const styles = StyleSheet.create({
    container: {
        width: '100%',        
        gap: wp(2),
        borderRadius: 4,
        borderWidth: 1 
    },
    header: {
        width: '100%', 
        flexDirection: 'row', 
        alignItems: "center", 
        height: hp(6),        
        justifyContent: "space-between", 
        paddingHorizontal: wp(2)        
    }
})