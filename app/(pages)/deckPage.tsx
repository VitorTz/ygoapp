import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import AddDeckToUserCollection from '@/components/AddDeckToUserCollection'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { getImageHeightCropped, hp, wp } from '@/helpers/util'
import { AppConstants } from '@/constants/AppConstants'
import { supaFetchCardsFromDeck, supaUserIsOwnerOfDeck } from '@/lib/supabase'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
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

    const deck = useLocalSearchParams()
    const [loading, setLoading] = useState(false)
    const [cards, setCards] = useState<Card[]>([])    
    const [userIsOwner, setUserIsOwner] = useState(false)
    const deck_id: number = deck.deck_id as any    

    const init = async () => {        
        setLoading(true)
        await supaFetchCardsFromDeck(deck_id).then(
            values => setCards([...values])
        )
        await supaUserIsOwnerOfDeck(deck_id).then(value => setUserIsOwner(value))
        setLoading(false)
    }

    useEffect(
        () => {            
            init()
        },
        []
    )

    const openCardPage = (card: Card) => {
        router.navigate({pathname: "/cardPage", params: card as any})
    }

    const navigateToEditDeck = () => {
        router.navigate({pathname: "/editDeck", params: deck as any})
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
                    <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 28}]}>
                        {deck.name}
                    </Text>
                                        
                    <View style={{paddingVertical: 8, paddingHorizontal: 10, borderRadius: 4, backgroundColor: Colors.gray, alignSelf: 'flex-start'}} >
                        <Text style={AppStyle.textRegular}>{deck.type} Deck</Text>
                    </View>
                    
                    {
                        deck.owner_name &&
                        <View style={{flexDirection: 'row', alignSelf: 'flex-start', gap: 6, alignItems: "center", backgroundColor: Colors.gray, borderRadius: 4, padding: 10, justifyContent: "center"}} >
                            <Text style={[AppStyle.textRegular, {textAlign: "center", fontSize: 14}]}>Created by</Text>
                            <Text style={AppStyle.textRegular}>{deck.owner_name}</Text>
                            <Image style={{width: 56, height: 56, borderRadius: 56}} source={deck.owner_image_url} contentFit='cover' />
                        </View>
                    }
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
                    {
                        !loading &&
                        <>
                        {
                            userIsOwner ?
                            <View style={{width: '100%', gap: 10}} >
                                <Text style={[AppStyle.textRegular, {color: Colors.orange, fontSize: 20}]}>
                                    You are the owner of this deck
                                </Text>
                                <Pressable onPress={navigateToEditDeck} hitSlop={AppConstants.hitSlopLarge} style={{width: '100%', height: 50, alignItems: "center", justifyContent: "center", backgroundColor: Colors.deckColor, borderRadius: 4}} >
                                    <Text style={AppStyle.textRegular} >Edit Deck</Text>
                                </Pressable>
                            </View>
                            :
                            <AddDeckToUserCollection deck_id={deck_id}/>
                        }
                        </>
                    }
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
        
        borderRadius: 4, 
        borderWidth: 1,
        borderColor: Colors.deckColor,        
        gap: 10,
        padding: wp(4)        
    }
})