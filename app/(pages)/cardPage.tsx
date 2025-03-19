import { 
    Pressable,
    SafeAreaView, 
    ScrollView, 
    StyleSheet,     
    View 
} from 'react-native'
import AddCardToUserCollection from '@/components/AddCardToUserCollection'
import CopyStringButton from '@/components/CopyStringButton'
import ShareImageButton from '@/components/ShareImageButton'
import { getImageHeight, wp } from '@/helpers/util'
import { router, useLocalSearchParams } from 'expo-router'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import BackButton from '@/components/BackButton'
import CardInfoFlatList from '@/components/CardInfoFlatList'
import { Card } from '@/helpers/types'
import { fetchRelatedCards } from '@/lib/supabase'
import CardPool from '@/components/CardsPool'
import { Ionicons } from '@expo/vector-icons'
import { AppConstants } from '@/constants/AppConstants'


const cardWidth = wp(80)
const cardHeight = getImageHeight(cardWidth)


const CardPage = () => {

    const card: any = useLocalSearchParams()
    const card_id: number = card.card_id as number

    const [relatedCards, setRelatedCards] = useState<Card[]>([])

    const init = async () => {
        await fetchRelatedCards(card.archetype).then(
            values => setRelatedCards([...values])
        )
    }

    useEffect(
        () => {
            init()
        },
        []
    )

    return (
        <SafeAreaView style={[AppStyle.safeArea, {padding: 20}]} >
            <ScrollView>
                <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}} >
                    <View style={{flexDirection: 'row', gap: 20}} >                        
                        <ShareImageButton color={Colors.red} image_url={card.image_url} />
                        <CopyStringButton color={Colors.red} text={card.name} />
                    </View>
                    <Pressable onPress={() => router.back()} hitSlop={AppConstants.hitSlopLarge}>
                        <Ionicons name='close-circle-outline' size={AppConstants.icon.size} color={Colors.cardColor} />
                    </Pressable>                    
                </View>
                <Image source={card.image_url} style={{alignSelf: "center", width: cardWidth, height: cardHeight, marginVertical: 20}} contentFit='cover' />

                <View style={styles.container} >
                    <CardInfoFlatList card={card} />
                    <AddCardToUserCollection card_id={card_id} />
                </View>
                {
                    card.archetype &&
                    <CardPool 
                        title={card.archetype}
                        cardsOnPool={relatedCards}
                        color={Colors.cardColor}
                        onCardPress={(card: Card) => router.navigate({pathname: "/cardPage", params: card as any})}
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
        borderRadius: 4,
        flex: 1,
        borderColor: Colors.red,
        gap: 10,
        padding: 20,
        borderWidth: 1,
        marginBottom: 10
    }
})