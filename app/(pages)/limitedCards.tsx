import { StyleSheet, SafeAreaView,  Text, View, ActivityIndicator, ScrollView } from 'react-native'
import { Card } from '@/helpers/types'
import { AppStyle } from '@/style/AppStyle'
import TopBar from '@/components/TopBar'
import BackButton from '@/components/BackButton'
import { Colors } from '@/constants/Colors'
import React, { useEffect, useRef, useState } from 'react'
import { LimitedCards } from '@/helpers/types'
import { fetchLimitedCards } from '@/lib/supabase'
import CardPool from '@/components/CardsPool'
import { router } from 'expo-router'


var limitedCards: LimitedCards | null = null

const LimitedCardsPage = () => {

    const [loading, setLoading] = useState(false)    
    
    const init = async () => {
        setLoading(true)        
        if (limitedCards == null) {            
            await fetchLimitedCards()
                .then(value => limitedCards = value)
        }
        setLoading(false)
    }

    useEffect(
        () => {
            init()
        },
        []
    )

    const onPress = (card: Card) => {
        router.navigate({pathname: "/cardPage", params: card as any})
    }


    return (
        <SafeAreaView style={AppStyle.safeArea} >            
            <TopBar title='Limited & Forbidden'>
                <BackButton color={Colors.red} />
            </TopBar>
            {
                loading ?
                
                <ActivityIndicator size={32} color={Colors.cardColor} /> :
                <ScrollView style={{flex: 1}} >
                    <View style={{width: '100%', gap: 10}} >
                        <CardPool
                            title='Forbidden'
                            cards={limitedCards ? limitedCards.forbidden : []}
                            onCardPress={onPress}
                            color={Colors.neonRed}
                        />
                        <CardPool
                            title='Limited 1'
                            cards={limitedCards ? limitedCards.limitedOne : []}
                            onCardPress={onPress}
                            color={Colors.uglyBlue}                
                        />
                        <CardPool
                            title='Limited 2'
                            cards={limitedCards ? limitedCards.limitedTwo : []}
                            onCardPress={onPress}
                            color={Colors.uglyBlue}
                        />
                    </View>
                </ScrollView>
            }
        </SafeAreaView>
    )
}

export default LimitedCardsPage
