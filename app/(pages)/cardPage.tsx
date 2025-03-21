import {     
    SafeAreaView, 
    ScrollView, 
    StyleSheet,     
    View 
} from 'react-native'
import AddCardToUserCollection from '@/components/AddCardToUserCollection'
import CopyStringButton from '@/components/CopyStringButton'
import ShareImage from '@/components/ShareImage'
import { getImageHeight, wp } from '@/helpers/util'
import { router, useLocalSearchParams } from 'expo-router'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { Image } from 'expo-image'
import React, { useContext, useEffect, useState } from 'react'
import BackButton from '@/components/BackButton'
import CardInfoFlatList from '@/components/CardInfoFlatList'
import { Card } from '@/helpers/types'
import CardPool from '@/components/CardsPool'
import { getRelatedCards } from '@/helpers/globals'
import { GlobalContext } from '@/helpers/context'


const cardWidth = wp(80)
const cardHeight = getImageHeight(cardWidth)


const CardPage = () => {

    const context = useContext(GlobalContext)
    const card: any = useLocalSearchParams()  

    const [relatedCards, setRelatedCards] = useState<Card[]>([])

    const init = async () => {
        await getRelatedCards(card.archetype, context.relatedCards)
            .then(values => setRelatedCards(values))
    }

    useEffect(
        () => { init() },
        []
    )

    return (
        <SafeAreaView style={[AppStyle.safeArea, {padding: 20}]} >
            <View style={styles.topBar} >
                <View style={{flexDirection: 'row', gap: 20}} >                        
                    <ShareImage color={Colors.red} image_url={card.image_url} />
                    <CopyStringButton color={Colors.red} text={card.name} />
                </View>
                <BackButton color={Colors.cardColor} />
            </View>
            <ScrollView>
                <Image source={card.image_url} style={{alignSelf: "center", width: cardWidth, height: cardHeight, marginVertical: 20}} contentFit='cover' />

                <View style={styles.container} >
                    <CardInfoFlatList card={card} />
                    <AddCardToUserCollection card={card} />
                </View>
                
                {
                    card.archetype &&
                    <CardPool 
                        title={card.archetype}
                        cards={relatedCards}
                        color={Colors.cardColor}
                        onCardPress={
                            (card: Card) => router.navigate({pathname: "/cardPage", params: card as any})
                        }
                    />
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default CardPage

const styles = StyleSheet.create({
    container: {
        width: '100%',        
        flex: 1,        
        gap: 10,
        marginBottom: 10
    },
    topBar: {
        width: '100%', 
        flexDirection: 'row', 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: 10
    }
})