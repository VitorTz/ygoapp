import {   
  ScrollView,   
  SafeAreaView, 
  StyleSheet,   
  View,   
  Text,
  Keyboard,  
  Pressable,
  FlatList,
  ActivityIndicator
} from 'react-native'
import React, { useEffect, useRef } from 'react'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { showToast, orderCards, wp, hp, getImageHeightCropped, sleep, getItemGridDimensions } from '@/helpers/util'
import { useState } from 'react'
import TopBar from '@/components/TopBar'
import { Card } from '@/helpers/types'
import Animated from 'react-native-reanimated'
import { FadeInUp } from 'react-native-reanimated'
import { AppConstants } from '@/constants/AppConstants'
import CardPool from '@/components/CardsPool'
import { fetchDeck, fetchDeckCards, supaCreateDeck } from '@/lib/supabase'
import CardComponent from '@/components/CardComponent'
import Toast from 'react-native-toast-message'
import { router, useLocalSearchParams } from 'expo-router'
import SearchCard from '@/components/SearchCard'
import { CreateDeckFormData } from '@/components/form/CreateDeckForm'
import CreateDeckForm from '@/components/form/CreateDeckForm'
import BackButton from '@/components/BackButton'
import DeckInfo from '@/components/DeckInfo'
import { Image } from 'expo-image'
import { API_CARD_CROPPED_WIDTH, API_CARD_CROPPED_HEIGHT } from '@/constants/AppConstants'
import { Ionicons } from '@expo/vector-icons'
import { Deck } from '@/helpers/types'
import { FlashList } from '@shopify/flash-list'


const deckWidth = wp(90)
const deckHeight = getImageHeightCropped(deckWidth)


const DeckCover = ({deck, cards}: {deck: Deck, cards: Card[]}) => {

  const [imageUrl, setImageUrl] = useState(deck.image_url)
  const [tempUrlImage, setTempImageUrl] = useState(deck.image_url)
  const [loading, setLoading] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  
  const flatListRef = useRef<FlatList | null>(null);

  const imageSet = new Set()
  cards.forEach(item => imageSet.add(item.cropped_image_url))
  const images = Array.from(imageSet)    

  const openGrid = async () => {
    setShowGrid(true)
    setLoading(true)    
    flatListRef.current?.scrollToIndex({
      index: 0,
      viewOffset: 50,
      animated: false,
    });
    await sleep(400)
    setLoading(false)
  }

  const closeGrid = () => {
    setShowGrid(false)
  }


  const saveChanges = async () => {

  }

  const {width, height} = getItemGridDimensions(
    10,
    30,
    2,
    API_CARD_CROPPED_WIDTH,
    API_CARD_CROPPED_HEIGHT
  )  
  
  return (
    <Animated.View 
      entering={FadeInUp.delay(100).duration(600)} >
            <Image 
                source={tempUrlImage} 
                style={{alignSelf: "center", width: deckWidth, height: deckHeight, marginVertical: 10}} 
                placeholder={AppConstants.blurhash}
                contentFit='cover' />
            
            {
              !showGrid &&
              <Pressable style={{
                  position: 'absolute', 
                  bottom: 20, 
                  right: 10, 
                  padding: 8, 
                  borderRadius: 32, 
                  borderWidth: 1,
                  borderColor: Colors.deckColor,
                  backgroundColor: Colors.gray}} 
                  onPress={openGrid} 
                  hitSlop={AppConstants.hitSlopLarge}
                >
                    <Ionicons name='brush-outline' size={30} color={Colors.deckColor} />
              </Pressable>
            }
            {
              showGrid &&
              <View style={{width: '100%', marginBottom: 10}} >
                <View style={{width: '100%', height: deckHeight - 100, borderRadius: 4, marginBottom: 10, borderWidth: 1, borderColor: Colors.deckColor}} >
                  {
                    loading ?
                    <View style={{width: '100%', height: '100%', alignItems: "center", justifyContent: "center"}} >
                      <ActivityIndicator size={64} color={Colors.deckColor} />
                    </View>
                    :
                    <View style={{width: deckWidth, height: deckHeight - 100}} >
                      <FlashList                        
                        data={images}
                        nestedScrollEnabled={true}                        
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        estimatedItemSize={height}
                        renderItem={({item, index}) => {
                            return <Pressable onPress={() => setTempImageUrl(item)} >
                              <Image source={item} style={{width: width, height: height, marginTop: index >= 2 ? 10 : 0, marginRight: 10}} />
                            </Pressable>
                        }}/>
                    </View>

                  }
                </View>
                <View style={{flexDirection: 'row', gap: 10}} >
                  <Pressable onPress={closeGrid} style={{flex: 1, height: 40, borderRadius: 4, backgroundColor: Colors.red, alignItems: "center", justifyContent: "center"}} >
                    <Text style={AppStyle.textRegular}>Cancel</Text>
                  </Pressable>
                  <Pressable onPress={saveChanges} style={{flex: 1, height: 40, borderRadius: 4, backgroundColor: Colors.deckColor, alignItems: "center", justifyContent: "center"}} >
                    <Text style={AppStyle.textRegular}>Save</Text>
                  </Pressable>
                </View>
              </View>
            }
    </Animated.View>
  )
}

const EditDeck = () => {
  
  const deck = useLocalSearchParams()
  const [cardsOnDeck, setCardsOnDeck] = useState<Card[]>([])
  const [cardToDisplay, setCardToDisplay] = useState<Card | null>(null)
  const [deckName, setDeckName] = useState(deck.name)
  const [deckDescription, setDeckDescription] = useState(deck.descr)  
  const cardsMap = useRef<Map<number, number>>(new Map())

  const init = async () => {
    const cards = await fetchDeckCards(deck.deck_id)
    setCardsOnDeck([...cards])    
    cards.forEach(
      card => {
        if (cardsMap.current.has(card.card_id)) {
          cardsMap.current.set(card.card_id, cardsMap.current.get(card.card_id)!)
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

  const changeDeckCover = () => {

  }

  return (
    <SafeAreaView style={AppStyle.safeArea} >
      <ScrollView style={{width: '100%'}} nestedScrollEnabled={true}>
        <TopBar title='Edit deck' marginBottom={20}>
          <BackButton color={Colors.deckColor}/>
        </TopBar>
        
        <DeckCover deck={deck} cards={cardsOnDeck} />

        <View style={styles.container} >
              <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 28}]}>{deck.name}</Text>                    
              <DeckInfo title='Archetypes' info={deck.archetypes} />
              <DeckInfo title='Attributes' info={deck.attributes} />
              <DeckInfo title='Frametypes' info={deck.frametypes} />
              <DeckInfo title='Races' info={deck.races} />
              <DeckInfo title='Types' info={deck.types} />
              {
                  deck.descr &&
                  <>                        
                      <Text style={[AppStyle.textRegular, {color: Colors.orange, fontSize: 28}]}>Description</Text>
                      <ScrollView style={{width: '100%', maxHeight: hp(30)}} nestedScrollEnabled={true} >                        
                          <Text style={AppStyle.textRegular}>{deck.descr}</Text>
                      </ScrollView>
                  </>
              }                    
        </View>
            
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