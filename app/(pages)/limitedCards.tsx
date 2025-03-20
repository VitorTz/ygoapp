import { StyleSheet, SafeAreaView,  Text, View, ActivityIndicator, ScrollView } from 'react-native'
import { Card } from '@/helpers/types'
import { AppStyle } from '@/style/AppStyle'
import TopBar from '@/components/TopBar'
import BackButton from '@/components/BackButton'
import { Colors } from '@/constants/Colors'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { LimitedCards } from '@/helpers/types'
import { fetchLimitedCards } from '@/lib/supabase'
import CardPool from '@/components/CardsPool'
import { router } from 'expo-router'
import { GlobalContext } from '@/helpers/context'


const LimitedCardsPage = () => {

    const context = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)    
    
    const init = async () => {
        setLoading(true)        
        if (context.limitedCards == null) {            
            await fetchLimitedCards()
                .then(value => context.limitedCards = value)
        }
        setLoading(false)
    }

    useEffect(
        () => { init() },
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
                            cards={context.limitedCards ? context.limitedCards.forbidden : []}
                            onCardPress={onPress}
                            color={Colors.neonRed}
                        />
                        <CardPool
                            title='Limited 1'
                            cards={context.limitedCards ? context.limitedCards.limitedOne : []}
                            onCardPress={onPress}
                            color={Colors.uglyBlue}                
                        />
                        <CardPool
                            title='Limited 2'
                            cards={context.limitedCards ? context.limitedCards.limitedTwo : []}
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
