import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import AddDeckToUserCollection from '@/components/AddDeckToUserCollection'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { getImageHeightCropped, hp, wp } from '@/helpers/util'
import { AppConstants } from '@/constants/AppConstants'
import { supaFetchCardsFromDeck } from '@/lib/supabase'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import CardGrid from '@/components/grid/CardGrid'
import BackButton from '@/components/BackButton'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors' 
import { Card } from '@/helpers/types'
import { Image } from 'expo-image'


const GRID_COLUMNS = 4


const DeckInfo = ({title, info}: {title: string, info: any}) => {
    return (
        <View>
            <Text style={[AppStyle.textHeader, {color: Colors.accentColor}]}>{title}</Text>
            <Text style={AppStyle.textRegular}>{info.replace(/,\s*/g, ', ')}</Text>
        </View>
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
            values => setCards([...values])
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
                    <BackButton color={Colors.deckColor} />
                </View>

                <Animated.View entering={FadeInUp.delay(100).duration(600)} >
                    <Image 
                        source={deck.image_url} 
                        style={{alignSelf: "center", width: deckWidth, height: deckHeight, marginVertical: 10}} 
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
                    <Text style={AppStyle.textHeader}>Description</Text>
                    <ScrollView style={{width: '100%', maxHeight: hp(30)}} nestedScrollEnabled={true} >                        
                        <Text style={AppStyle.textRegular}>{deck.descr}</Text>
                    </ScrollView>
                    <AddDeckToUserCollection deck_id={deck_id}/>
                </View>

                <View style={{marginTop: 10}} >
                    <CardGrid 
                        cards={cards} 
                        numColumns={GRID_COLUMNS}
                        hasResults={true}
                        loading={false}/>
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
        gap: 10,
        padding: wp(4)        
    }
})