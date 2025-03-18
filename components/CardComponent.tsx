import { StyleSheet, FlatList, Pressable, ScrollView, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useState } from 'react'
import { FadeIn } from 'react-native-reanimated'
import { wp, hp } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import { AppConstants } from '@/constants/AppConstants'
import { AppStyle } from '@/style/AppStyle'
import { getImageHeight } from '@/helpers/util'
import { Card } from '@/helpers/types'
import React from 'react'
import TopBar from './TopBar'
import CardInfoFlatList from './CardInfoFlatList'
import AddCardToUserCollection from './AddCardToUserCollection'
import CopyCardToDeck from './CopyCardToDeck'



const CardComponent = ({
    card, 
    closeCardComponent,
    numCardsOnDeck,
    addCard,
    rmvCard,
  }: {
    card: Card, 
    closeCardComponent: () => void,
    addCard: (card: Card) => void,
    rmvCard: (card: Card) => void,
    numCardsOnDeck: number
  }) => {
      
    const cardWidth = wp(90)
    const cardHeight = getImageHeight(cardWidth)
    
    return (      
      <Animated.View 
        entering={FadeIn.duration(500)} 
        style={styles.container}>
          <TopBar title='Card'>
            <Pressable onPress={closeCardComponent} hitSlop={AppConstants.hitSlopLarge} >
              <Ionicons name='close-circle-outline' size={42} color={Colors.cardColor} />
            </Pressable>
          </TopBar>
          <ScrollView style={{flex: 1}} >    
            <View style={{flex: 1, gap: 10}}>            
              
              <Image style={{width: cardWidth, height: cardHeight}} source={card.image_url} />
              
              <View style={styles.infoContainer} >
                <CardInfoFlatList card={card} />
                <CopyCardToDeck add={addCard} rmv={rmvCard} card={card} numCardsOnDeck={numCardsOnDeck} />
                <AddCardToUserCollection card_id={card.card_id}/>
              </View>
            </View>
          </ScrollView>
      </Animated.View>
    )
  }

export default CardComponent

const styles = StyleSheet.create({
  container: {
    position: 'absolute', 
    top: 0,
    width: wp(100),
    height: hp(100),
    padding: wp(5), 
    backgroundColor: Colors.background
  },
  infoContainer: {
    width: '100%', 
    padding: wp(5),     
    borderRadius: 4, 
    borderWidth: 1, 
    borderColor: Colors.red, 
    gap: 10
  }
})