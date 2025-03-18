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
import { showToast, orderCards, wp, hp } from '@/helpers/util'
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


const EditDeck = () => {
  
  const deck: any = useLocalSearchParams()
  const [cardsOnDeck, setCardsOnDeck] = useState<Card[]>([])
  const [cardToDisplay, setCardToDisplay] = useState<Card | null>(null)
  const [deckName, setDeckName] = useState<string>('')
  const [deckDescription, setDeckDescription] = useState<string | null>('')
  const cardsMap = useRef<Map<number, number>>(new Map())
  
  
  const init = async () => {
    const cards = await fetchDeckCards(deck.deck_id as any)
    cardsMap.current.clear()
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
    setDeckName(deck.name)    
    setDeckDescription(deck.descr)
  }

  useEffect(
    () => {
      init()
    },
    []
  )

  const onSubmit = async (formData: EditDeckFormData) => {    
    if (cardsOnDeck.length == 0) {
      showToast("Error", "Your deck has 0 cards", "error")
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
      showToast("Error", "could not update deck", "error")
      return
    }
    router.back()
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
        <TopBar title='Edit deck' marginBottom={20}>
          <BackButton color={Colors.deckColor}/>
        </TopBar>
        
        <DeckCover deck={deck as any} cards={cardsOnDeck} />

        <View style={styles.container} >
              <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 28}]}>{deckName}</Text>
              <DeckInfo title='Archetypes' info={deck.archetypes} />
              <DeckInfo title='Attributes' info={deck.attributes} />
              <DeckInfo title='Frametypes' info={deck.frametypes} />
              <DeckInfo title='Races' info={deck.races} />
              <DeckInfo title='Types' info={deck.types} />
              {
                  deckDescription &&
                  <>                        
                      <Text style={[AppStyle.textRegular, {color: Colors.orange, fontSize: 28}]}>Description</Text>
                      <ScrollView style={{width: '100%', maxHeight: hp(30)}} nestedScrollEnabled={true} >                        
                          <Text style={AppStyle.textRegular}>{deckDescription}</Text>
                      </ScrollView>
                  </>
              }                    
        </View>
            
        <View style={{width: '100%', gap: 10}} >
          <EditDeckForm 
            deck_id={deck.deck_id}
            defaultName={deckName} 
            defaultDescr={deckDescription} 
            defaultIsPublic={deck.is_public as any} 
            setName={setDeckName} 
            setDescr={setDeckDescription} 
            onSubmit={onSubmit} />
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