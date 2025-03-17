import {   
  ScrollView,   
  SafeAreaView, 
  StyleSheet,   
  View,   
  Keyboard  
} from 'react-native'
import React, { useRef } from 'react'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { showToast, orderCards, sleep } from '@/helpers/util'
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


const CreateDeck = () => {
  
  const [cardsOnDeck, setCardsOnDeck] = useState<Card[]>([])
  const [cardToDisplay, setCardToDisplay] = useState<Card | null>(null)
  const cardsMap = useRef<Map<number, number>>(new Map())

  const onSubmit = async (formData: CreateDeckFormData) => {    
    if (cardsOnDeck.length == 0) {
      showToast("Error", "Your deck has 0 cards", "error")
      return
    }    
    const success = await supaCreateDeck(
      formData.name, 
      formData.description, 
      formData.isPublic, 
      cardsOnDeck
    )
    if (!success) {
      showToast("Error", "Could not create deck", "error")
      return
    }    
    router.replace("/(pages)/editDeck")
  }

  const getNumCardsOnDeck = (card: Card) => {
    return cardsMap.current.get(card.card_id) ? cardsMap.current.get(card.card_id)! : 0
  }

  const addCardToDeck = async (card: Card) => {
    const n: number = getNumCardsOnDeck(card)
    if (n >= 3) {
      showToast("Warning", "Max 3 cards", "info")
      return
    }
    cardsMap.current.set(card.card_id, n + 1)    
    setCardsOnDeck(prev => orderCards([...prev, ...[card]]))
  }

  const rmvCardFromDeck = async (card: Card) => {
    const n: number = getNumCardsOnDeck(card)
    if (n == 0) {
      showToast("Warning", "0 cards on deck", "info")
      return
    }
    cardsMap.current.set(card.card_id, n - 1)
    
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
            cardsOnPool={cardsOnDeck}
            onCardPress={openCardComponent}
            color={Colors.deckColor}/>
          <SearchCard openCardComponent={openCardComponent}/>
        </View>
      </ScrollView>
      {
        cardToDisplay && 
        <CardComponent 
          numCardsOnDeck={getNumCardsOnDeck(cardToDisplay)}
          closeCardComponent={closeCardComponent} 
          card={cardToDisplay} 
          addCard={addCardToDeck} 
          rmvCard={rmvCardFromDeck}/>
      }      
    </SafeAreaView>
  )
}

export default CreateDeck

const styles = StyleSheet.create({

})