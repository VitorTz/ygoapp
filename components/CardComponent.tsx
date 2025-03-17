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
import CardInfo from './CardInfo'
import React from 'react'
import TopBar from './TopBar'
import BackButton from './BackButton'


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
  
    const [copiesOnDeck, setCopiesOnDeck] = useState(numCardsOnDeck)
    const cardWidth = wp(90)
    const cardHeight = getImageHeight(cardWidth)
    
    const card_info = [
        {value: card.attack, title: 'Attack'},
        {value: card.defence, title: 'Defence'},
        {value: card.level, title: 'Level'},
        {value: card.attribute, title: 'Attribute'},
        {value: card.archetype, title: 'Archetype'},
        {value: card.frametype, title: 'Frametype'},
        {value: card.race, title: 'Race'},
        {value: card.type, title: 'Type'}
    ]
  
    const add = async () => {
      setCopiesOnDeck(prev => prev <= 2 ? prev + 1 : prev)
      await addCard(card)
    }
  
    const rmv = async () => {
      setCopiesOnDeck(prev => prev > 0 ? prev - 1 : prev)
      await rmvCard(card)
    }
  
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
                <FlatList
                    data={card_info}
                    keyExtractor={(item) => item.title}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => <CardInfo title={item.title} value={item.value} />}
                />                
                <View style={{width: '100%', gap: 10}} >
                  <Text style={[AppStyle.textHeader, {color: Colors.red}]}>Description</Text>
                  <Text style={[AppStyle.textRegular, {fontSize: 18}]}>{card.descr}</Text>
                </View>          
                <Text style={[AppStyle.textHeader, {color: Colors.red}]}>Copies on deck: {copiesOnDeck}</Text>              
                
                <View style={{width: '100%', flexDirection: 'row', gap: 20}} >
                  <Pressable onPress={rmv} style={styles.button} >
                    <Ionicons name='remove-outline' size={32} color={Colors.white} />
                  </Pressable>
                  <Pressable onPress={add} style={styles.button} >
                    <Ionicons name='add-outline' size={32} color={Colors.white} />
                  </Pressable>
                </View>

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
  button: {
    flex: 1, 
    height: 50, 
    borderRadius: 4, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: Colors.red
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