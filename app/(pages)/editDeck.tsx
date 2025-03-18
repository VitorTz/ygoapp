import {   
  ScrollView,   
  SafeAreaView, 
  StyleSheet,   
  View,   
  Text,
  Keyboard  
} from 'react-native'
import React, { useEffect, useRef } from 'react'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { orderCards, wp, hp } from '@/helpers/util'
import { useState } from 'react'
import TopBar from '@/components/TopBar'
import { Card, Deck } from '@/helpers/types'
import CardPool from '@/components/CardsPool'
import { fetchDeckCards, supabase, supaCreateDeck, supaUpdateDeck } from '@/lib/supabase'
import CardComponent from '@/components/CardComponent'
import { router, useLocalSearchParams } from 'expo-router'
import SearchCard from '@/components/SearchCard'
import EditDeckForm, { EditDeckFormData} from '@/components/form/EditDeckForm'
import BackButton from '@/components/BackButton'
import DeckInfo from '@/components/DeckInfo'
import DeckCover from '@/components/DeckCover'
import Toast from '@/components/Toast'


const EditDeck = () => {
  
  const deck: any = useLocalSearchParams()
  const [cardsOnDeck, setCardsOnDeck] = useState<Card[]>([])
  const [cardToDisplay, setCardToDisplay] = useState<Card | null>(null)
  const cardsMap = useRef<Map<number, number>>(new Map())
    
  const init = async () => {
    cardsMap.current.clear()
    const cards = await fetchDeckCards(deck.deck_id as any)
    setCardsOnDeck([...cards])    
    cards.forEach(
      card => {
        if (cardsMap.current.has(card.card_id)) {
          cardsMap.current.set(card.card_id, cardsMap.current.get(card.card_id)! + 1)
        } else {
          cardsMap.current.set(card.card_id, 1)
        }
      }
    )    
  }

  useEffect(
    () => {
      init()
    },
    []
  )

  const onSubmit = async (formData: EditDeckFormData) => {    
    if (cardsOnDeck.length == 0) {
      Toast.show({title: "Error", message: "Your deck has 0 cards", type: 'error'})      
      return
    }    
    const success = await supaUpdateDeck(
      deck.deck_id,
      formData.name,
      formData.description,
      formData.isPublic,
      cardsOnDeck
    )
    if (!success) {
      Toast.show({title: "Error", message: "couldnot update deck", type: 'error'})      
      return
    }
    Toast.show({title: "Success", message: "Deck updated", type: "success"})
  }

  const getNumCardsOnDeck = (card: Card) => {
    return cardsMap.current.get(card.card_id) ? cardsMap.current.get(card.card_id)! : 0
  }

  const addCardToDeck = async (card: Card) => {
    const n: number = getNumCardsOnDeck(card)
    if (n >= 3) {
      Toast.show({title: "Warning", message: "Max 3 cards", type: 'info'})      
      return
    }
    cardsMap.current.set(card.card_id, n + 1)    
    setCardsOnDeck(prev => orderCards([...prev, ...[card]]))
  }

  const rmvCardFromDeck = async (card: Card) => {
    const n: number = getNumCardsOnDeck(card)
    if (n == 0) {
      Toast.show({title: "Warning", message: "You have 0 cards on this deck", type: 'info'})
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
        <TopBar title='Edit deck' marginBottom={20}>
          <BackButton color={Colors.deckColor}/>
        </TopBar>
        
        <DeckCover deck={deck as any} cards={cardsOnDeck} />
            
        <View style={{width: '100%', gap: 10}} >
          <EditDeckForm 
            deck={deck}
            onSubmit={onSubmit} />
          <CardPool
            cardsOnPool={cardsOnDeck}
            onCardPress={openCardComponent}
            color={Colors.deckColor}/>
          <SearchCard openCardComponent={openCardComponent} color={Colors.deckColor}/>
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

export default EditDeck

const styles = StyleSheet.create({  
  container: {
    width: '100%',         
    borderRadius: 4, 
    borderWidth: 1,
    borderColor: Colors.deckColor,
    flex: 1, 
    gap: 10,
    padding: wp(4),
    marginBottom: 20,
  }
})