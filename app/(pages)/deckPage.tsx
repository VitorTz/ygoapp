import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import AddDeckToUserCollection from '@/components/AddDeckToUserCollection'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { getImageHeightCropped, hp, wp } from '@/helpers/util'
import { AppConstants } from '@/constants/AppConstants'
import { supaFetchCardsFromDeck } from '@/lib/supabase'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import CardGrid from '@/components/grid/CardGrid'
import BackButton from '@/components/BackButton'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors' 
import { Card } from '@/helpers/types'
import { Image } from 'expo-image'
import TopBar from '@/components/TopBar'
import CardPool from '@/components/CardsPool'
import DeckInfo from '@/components/DeckInfo'


const deckWidth = wp(90)
const deckHeight = getImageHeightCropped(deckWidth)


const DeckPage = () => {

    const [cards, setCards] = useState<Card[]>([])
    const deck = useLocalSearchParams()
    const deck_id: number = parseInt(deck.deck_id)    

    const init = async () => {        
        await supaFetchCardsFromDeck(deck_id).then(
            values => setCards([...values])
        )        
    }

    useEffect(
        () => {            
            init()
        },
        []
    )

    const openCardPage = (card: Card) => {
        router.navigate({pathname: "/cardPage", params: card})
    }

    return (
        <SafeAreaView style={[AppStyle.safeArea, {padding: wp(5)}]} >
            <TopBar title='Deck' marginBottom={10} >
                <BackButton color={Colors.deckColor} />
            </TopBar>
            <ScrollView>
                <Animated.View entering={FadeInUp.delay(100).duration(600)} >
                    <Image 
                        source={deck.image_url} 
                        style={{alignSelf: "center", width: deckWidth, height: deckHeight, marginVertical: 10}} 
                        placeholder={AppConstants.blurhash}
                        contentFit='cover' />
                </Animated.View>

                <View style={styles.container} >
                    <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 28}]}>{deck.name}</Text>                    
                    <DeckInfo title='Archetypes' info={deck.archetypes} />
                    <DeckInfo title='Attributes' info={deck.attributes} />
                    <DeckInfo title='Frametypes' info={deck.frametypes} />
                    <DeckInfo title='Races' info={deck.races} />
                    <DeckInfo title='Types' info={deck.types} />
                    {
                        deck.descr &&
                        <>                        
                            <Text style={[AppStyle.textRegular, {color: Colors.orange, fontSize: 28}]}>Description</Text>
                            <ScrollView style={{width: '100%', maxHeight: hp(30)}} nestedScrollEnabled={true} >                        
                                <Text style={AppStyle.textRegular}>{deck.descr}</Text>
                            </ScrollView>
                        </>
                    }
                    <AddDeckToUserCollection deck_id={deck_id}/>
                </View>

                <View style={{width: '100%', marginTop: 10}} >
                    <CardPool
                        cardsOnPool={cards}
                        color={Colors.deckColor}
                        onCardPress={openCardPage}
                        height={hp(100)}/>                    
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DeckPage

const styles = StyleSheet.create({
    container: {
        width: '100%',         
        borderRadius: 4, 
        borderWidth: 1,
        borderColor: Colors.deckColor,
        flex: 1, 
        gap: 10,
        padding: wp(4)        
    }
})