import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import AddDeckToUserCollection from '@/components/AddDeckToUserCollection'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { getImageHeightCropped, hp, wp } from '@/helpers/util'
import { Deck } from '@/helpers/types'
import { AppConstants } from '@/constants/AppConstants'
import { fetchCardsFromDeck } from '@/lib/supabase'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import BackButton from '@/components/BackButton'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors' 
import { Card } from '@/helpers/types'
import { Image } from 'expo-image'
import TopBar from '@/components/TopBar'
import CardPool from '@/components/CardsPool'
import DeckInfo from '@/components/DeckInfo'
import DeckComments from '@/components/DeckComments'


const deckWidth = wp(90)
const deckHeight = getImageHeightCropped(deckWidth)



const DeckOwnerComponent = ({deck}: {deck: Deck}) => {
    return (
        <>
            {
                deck.owner_name &&
                <View style={{flexDirection: 'row', alignSelf: 'flex-start', gap: 6, alignItems: "center", backgroundColor: Colors.gray, borderRadius: 4, padding: 10, justifyContent: "center"}} >
                    <Text style={[AppStyle.textRegular, {textAlign: "center", fontSize: 14}]}>Owner:</Text>
                    <Text style={AppStyle.textRegular}>{deck.owner_name}</Text>
                    <Image style={{width: 56, height: 56, borderRadius: 56}} source={deck.owner_image_url} contentFit='cover' />
                </View>
            }
        </>
    )
}

const DeckInfoComp = ({deck}: {deck: Deck}) => {
    return (
        <>
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
        </>
    )
}

const DeckPage = () => {

    const deck = useLocalSearchParams() as any    
    const [cards, setCards] = useState<Card[]>([])        
    
    const init = async () => {                
        await fetchCardsFromDeck(deck.deck_id)
            .then(values => setCards([...values]))
    }

    useEffect(
        () => { init() },
        []
    )

    return (
        <SafeAreaView style={[AppStyle.safeArea, {padding: wp(5)}]} >
            <TopBar title='Deck' marginBottom={10} >
                <BackButton color={Colors.deckColor} />
            </TopBar>
            <ScrollView>
                <View style={{width: '100%', gap: 10}} >
                    <Animated.View entering={FadeInUp.duration(600)} >
                        <Image 
                            source={deck.image_url} 
                            style={{alignSelf: "center", width: deckWidth, height: deckHeight}} 
                            placeholder={AppConstants.blurhash}
                            contentFit='cover' />
                    </Animated.View>

                    
                    <Animated.View entering={FadeInDown.duration(600)} style={styles.container} >
                        <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 28}]}>
                            {deck.name}
                        </Text>
                                            
                        <View style={styles.deckType} >
                            <Text style={AppStyle.textRegular}>{deck.type} Deck</Text>
                        </View>

                        <DeckOwnerComponent deck={deck}/>
                        <DeckInfoComp deck={deck} />
                        <AddDeckToUserCollection deck={deck} />                    
                    </Animated.View>

                    <CardPool cards={cards} height={hp(100)}/>
                    <DeckComments deck={deck} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DeckPage

const styles = StyleSheet.create({
    container: {        
        gap: 10        
    },
    deckType: {
        paddingVertical: 8, 
        paddingHorizontal: 10, 
        borderRadius: 4, 
        backgroundColor: Colors.gray, 
        alignSelf: 'flex-start'
    }
})