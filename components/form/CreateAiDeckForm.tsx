import {   
  ScrollView,   
  SafeAreaView, 
  StyleSheet,   
  View,   
  Keyboard  
} from 'react-native'
import React, { useEffect, useRef } from 'react'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { orderCards, sleep } from '@/helpers/util'
import { useState } from 'react'
import TopBar from '@/components/TopBar'
import { Card } from '@/helpers/types'
import CardPool from '@/components/CardsPool'
import { supaCreateDeck } from '@/lib/supabase'
import CardComponent from '@/components/CardComponent'
import { router } from 'expo-router'
import SearchCard from '@/components/SearchCard'
import { CreateDeckFormData } from '@/components/form/CreateDeckForm'
import CreateDeckForm from '@/components/form/CreateDeckForm'
import BackButton from '@/components/BackButton'
import Toast from '@/components/Toast'


const cardsMap = new Map<number, number>()

const getNumCardsOnDeck = (card: Card) => {
    return cardsMap.get(card.card_id) ? cardsMap.get(card.card_id)! : 0
}

const CreateAiDeck = () => {
  
    const [cardsOnDeck, setCardsOnDeck] = useState<Card[]>([])
    const [cardToDisplay, setCardToDisplay] = useState<Card | null>(null)

    useEffect(
        () => { cardsMap.clear() },
        []
    )

    const onSubmit = async (formData: CreateDeckFormData) => {    
        if (cardsOnDeck.length == 0) {
            Toast.show({title: "Error", message: "Your deck has 0 cards", type: 'error'})      
            return
        }
        await supaCreateDeck(
            formData.name, 
            formData.description, 
            formData.isPublic, 
            cardsOnDeck
        ).then(
            success =>
                success ? 
                    router.replace("/(pages)/editDeck") :
                    Toast.show({title: "Error", message: "could not create deck", type: 'error'})
        )
  }
  
  const addCardToDeck = async (card: Card) => {
    const n: number = getNumCardsOnDeck(card)
    if (n >= 3) {
      Toast.show({title: "Warning", message: "Max 3 cards", type: 'info'})
      return
    }
    cardsMap.set(card.card_id, n + 1)    
    setCardsOnDeck(prev => orderCards([...prev, ...[card]]))
  }

  const rmvCardFromDeck = async (card: Card) => {
    const n: number = getNumCardsOnDeck(card)
    if (n == 0) {
      Toast.show({title: "Warning", message: "You already have 0 cards on deck", type: 'info'})
      return
    }
    cardsMap.set(card.card_id, n - 1)
    
    setCardsOnDeck(
      prev => {
        let find = false
        return prev.filter(
          (value, index, array) => {
            if (value.card_id != card.card_id) {
              return true
            }
            if (find == true) {
              return true
            }
            find = true
            return false
          }
        )
      }
    )
  }

  const openCardComponent = (card: Card) => {
    Keyboard.dismiss()
    setCardToDisplay(card)
  }

  const closeCardComponent = () => {
    setCardToDisplay(null)
  }

  return (
    <SafeAreaView style={AppStyle.safeArea} >
      <ScrollView style={{width: '100%'}} nestedScrollEnabled={true}>
        <TopBar title='Create deck'>
          <BackButton color={Colors.deckColor}/>
        </TopBar>
        <View style={{width: '100%', gap: 10}} >
          <CreateDeckForm onSubmit={onSubmit} />
          <CardPool
            cards={cardsOnDeck}
            onCardPress={openCardComponent}
            color={Colors.deckColor}/>
          <SearchCard onCardPress={openCardComponent}/>
        </View>
      </ScrollView>
      {
        cardToDisplay && 
        <CardComponent          
          closeCardComponent={closeCardComponent} 
          card={cardToDisplay} 
          addCard={addCardToDeck} 
          rmvCard={rmvCardFromDeck}/>
      }      
    </SafeAreaView>
  )
}

export default CreateAiDeck

const styles = StyleSheet.create({

})