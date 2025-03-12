import { SafeAreaView, Keyboard, ScrollView, FlatList, StyleSheet, Text, View, Pressable } from 'react-native'
import AddDeckToUserCollection from '@/components/AddDeckToUserCollection'
import { Ionicons } from '@expo/vector-icons'
import { AppStyle } from '@/style/AppStyle'
import { API_CARD_CROPPED_WIDTH, API_CARD_HEIGHT, API_CARD_WIDTH, AppConstants } from '@/constants/AppConstants'
import { router, useLocalSearchParams } from 'expo-router'
import { Colors } from '@/constants/Colors' 
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { getImageHeightCropped, getItemGridDimensions, hp, wp } from '@/helpers/util'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Card } from '@/helpers/types'
import { supaFetchCardsFromDeck } from '@/lib/supabase'
import CardGrid from '@/components/CardGrid'
import { FlashList } from '@shopify/flash-list'



const {width: cardWidth, height: cardHeight} = getItemGridDimensions(wp(5), 20, 4, API_CARD_WIDTH, API_CARD_HEIGHT)
const GRID_COLUMNS = 4


const DeckInfo = ({title, info}: {title: string, info: string}) => {
    return (
        <View>
            <Text style={AppStyle.textHeader}>{title}</Text>
            <Text style={AppStyle.textRegular}>{info.replace(/,\s*/g, ', ')}</Text>
        </View>
    )
}

const CardItem = ({card, index}: {card: Card, index: number}) => {
    
    const handlePress = () => {
        Keyboard.dismiss()
        router.navigate({pathname: "/(pages)/cardPage", params: card})
    }
    
    return (
        <Pressable onPress={handlePress}>
            <Image style={{width: cardWidth, height: cardHeight, marginTop: index >= GRID_COLUMNS ? 10 : 0}} source={card.image_url} />    
        </Pressable>
    )
}

const DeckPage = () => {

    const [cards, setCards] = useState<Card[]>([])
    const deck = useLocalSearchParams()
    const deck_id: number = parseInt(deck.deck_id)

    const deckWidth = wp(90)
    const deckHeight = getImageHeightCropped(deckWidth)
    
    const init = async () => {
        await supaFetchCardsFromDeck(deck_id).then(
            values => {console.log(values.length); setCards([...values])}
        )
    }

    useEffect(
        () => {            
            init()
        },
        []
    )

    return (
        <SafeAreaView style={[AppStyle.safeArea, {padding: wp(5)}]} >
            <ScrollView>
                <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "flex-end"}} >
                    <Ionicons onPress={() => router.back()} name='chevron-back-circle-outline' size={AppConstants.icon.size} color={Colors.orange} />
                </View>

                <Animated.View entering={FadeInUp.delay(100).duration(600)} >
                    <Image 
                        source={deck.image_url} 
                        style={{alignSelf: "center", width: deckWidth, height: deckHeight, marginVertical: 10, borderRadius: 4, borderWidth: 1, borderColor: Colors.orange}} 
                        placeholder={AppConstants.blurhash}                        
                        contentFit='cover' />
                </Animated.View>

                <View style={styles.container} >
                    <Text style={AppStyle.textHeader}>{deck.name}</Text>                    
                    <DeckInfo title='Archetypes' info={deck.archetypes} />
                    <DeckInfo title='Attributes' info={deck.attributes} />
                    <DeckInfo title='Frametypes' info={deck.frametypes} />
                    <DeckInfo title='Races' info={deck.races} />
                    <DeckInfo title='Types' info={deck.types} />
                    <AddDeckToUserCollection deck_id={deck_id} />
                </View>

                <View style={[styles.container, {flexDirection: 'row', flexWrap: 'wrap', alignItems: "center", justifyContent: "center", marginTop: 10, padding: 10}]} >
                    <CardGrid cards={cards} numColumns={GRID_COLUMNS} hasResults={true} RenderItem={CardItem} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DeckPage

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        backgroundColor: Colors.gray, 
        borderRadius: 4, 
        flex: 1, 
        borderColor: Colors.orange, 
        gap: 10,
        padding: wp(4),
        borderWidth: 1
    }
})