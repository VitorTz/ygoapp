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
import { supabaseGetDeckCards, supabase, supabaseCreateDeck, supabaseUpdateDeck } from '@/lib/supabase'
import CardComponent from '@/components/CardComponent'
import { router, useLocalSearchParams } from 'expo-router'
import SearchCard from '@/components/SearchCard'
import EditDeckForm, { EditDeckFormData} from '@/components/form/EditDeckForm'
import BackButton from '@/components/BackButton'
import DeckInfo from '@/components/DeckInfo'
import DeckCover from '@/components/DeckCover'
import Toast from '@/components/Toast'
import CreateDeckForm from '@/components/form/CreateDeckForm'


const cardsMap = new Map<number, number>()

const getNumCardsOnDeck = (card: Card) => {        
  return cardsMap.get(card.card_id) ? cardsMap.get(card.card_id)! : 0
}


const EditDeck = () => {
  
  const deck: any = useLocalSearchParams()
  const [cardsOnDeck, setCardsOnDeck] = useState<Card[]>([])
  const [cardToDisplay, setCardToDisplay] = useState<Card | null>(null)

  console.log(deck.deck_id)
    
  const init = async () => {
    cardsMap.clear()
    await supabaseGetDeckCards(deck.deck_id as any)
      .then(
        values => {
            setCardsOnDeck([...values])
            values.forEach(
              card => {
                if (cardsMap.has(card.card_id)) {
                  cardsMap.set(card.card_id, cardsMap.get(card.card_id)! + 1)
                } else {
                  cardsMap.set(card.card_id, 1)
                }
              }
            )    
        }
      )
  }

  useEffect(
    () => { init() },
    []
  )

  const onSubmit = async (formData: EditDeckFormData) => {    
    if (cardsOnDeck.length == 0) {
      Toast.show({title: "Error", message: "Your deck has 0 cards", type: 'error'})      
      return
    }    

    console.log(formData.name)
    await supabaseUpdateDeck(
      deck.deck_id,
      formData.name,
      formData.description,
      formData.isPublic,
      cardsOnDeck
    ).then(success => {
      success ?
        Toast.show({title: "Success", message: "Deck updated", type: "success"}) :    
        Toast.show({title: "Error", message: "couldnot update deck", type: 'error'})        
    })
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
      Toast.show({title: "Warning", message: "You have 0 cards on this deck", type: 'info'})
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
        <TopBar title='Edit deck' marginBottom={20}>
          <BackButton color={Colors.deckColor}/>
        </TopBar>
        
        <DeckCover deck={deck as any} cards={cardsOnDeck} />
            
        <View style={{width: '100%', gap: 10}} >
          <EditDeckForm deck={deck} onSubmit={onSubmit} />
          <CardPool
            cards={cardsOnDeck}
            onCardPress={openCardComponent}
            color={Colors.deckColor}/>
          <SearchCard 
            onCardPress={openCardComponent} 
            color={Colors.deckColor}/>
        </View>
      </ScrollView>
      {
        cardToDisplay && 
        <CardComponent          
          closeCardComponent={closeCardComponent}
          getNumCardsOnDeck={getNumCardsOnDeck}
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
    flex: 1, 
    gap: 10,
    padding: wp(4),
    marginBottom: 20,
  }
})