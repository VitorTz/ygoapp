import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import { Card } from '@/helpers/types'
import { hp, wp } from '@/helpers/util'
import { AppStyle } from '@/style/AppStyle'
import CardGrid from './grid/CardGrid'


const CardsPool = ({
    cards, 
    onPress,
    color = Colors.orange
}: {
    cards: Card[], 
    onPress: (card: Card) => void,
    color?: string
}) => {
    return (
        <View style={[styles.container, {borderColor: color}]} >
            <View style={[styles.header, {backgroundColor: color}]} >
                <Text style={[AppStyle.textRegular, {fontSize: hp(2.8)}]} >Cards</Text>
                <Text style={[AppStyle.textRegular, {fontSize: hp(2.8)}]}>Total: {cards.length}</Text>
            </View>
            <CardGrid
                cards={cards}
                hasResults={true}
                loading={false}
                numColumns={4}
                onCardPress={onPress}
                gap={20}                    
            />
        </View>
    )
}

export default CardsPool

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: hp(54),
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