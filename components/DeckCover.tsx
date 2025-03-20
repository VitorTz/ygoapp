import { StyleSheet, FlatList, Pressable, Text, View } from 'react-native'
import { useState, useRef, useEffect } from 'react'
import { sleep, wp, getImageHeightCropped, getItemGridDimensions } from '@/helpers/util'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { AppConstants } from '@/constants/AppConstants'
import { ActivityIndicator } from 'react-native'
import { FadeInUp } from 'react-native-reanimated'
import Toast from './Toast'
import Animated from 'react-native-reanimated'
import { API_CARD_CROPPED_WIDTH, API_CARD_CROPPED_HEIGHT } from '@/constants/AppConstants'
import { FlashList } from '@shopify/flash-list'
import { supabase, supabaseUpdateDeckCoverImage } from '@/lib/supabase'
import { Deck, Card } from '@/helpers/types'
import React from 'react'


const deckWidth = wp(90)
const deckHeight = getImageHeightCropped(deckWidth)

const {width, height} = getItemGridDimensions(
  10,
  30,
  2,
  API_CARD_CROPPED_WIDTH,
  API_CARD_CROPPED_HEIGHT
)  

var imageSet = new Set<string>()
var images: string[] = []

const DeckCover = ({deck, cards}: {deck: Deck, cards: Card[]}) => {

  const [imageUrl, setImageUrl] = useState(deck.image_url)
  const [tempUrlImage, setTempImageUrl] = useState(deck.image_url)
  const [showGrid, setShowGrid] = useState(false)
  const [isSaving, setIsSaving] = useState(false)    

  const init = () => {
    imageSet.clear()
    cards.forEach(item => imageSet.add(item.cropped_image_url))
    images = Array.from(imageSet)
  }

  useEffect(
    () => {
      init()
    },
    [cards]
  )

  const openGrid = async () => {
    setShowGrid(true)    
  }

  const closeGrid = () => {
    setShowGrid(false)
  }

  const cancelChanges = () => {
    closeGrid()
    setTempImageUrl(imageUrl)
  }

  const saveChanges = async () => {
    setIsSaving(true)
    const { error } = await supabaseUpdateDeckCoverImage(deck.deck_id, tempUrlImage!)
    if (error) {
      console.log(error)
      Toast.show({title: "Error", message: "could not update deck image", type: "error"})      
      setTempImageUrl(imageUrl)
    }
    setIsSaving(false)
    deck.image_url = tempUrlImage
    setImageUrl(tempUrlImage)
    closeGrid()
  }

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
                    <Ionicons name='brush-outline' size={32} color={Colors.deckColor} />
              </Pressable>
            }
            {
              showGrid &&
              <View style={{width: '100%', marginBottom: 10}} >
                <View style={{width: '100%', height: deckHeight - 100, borderRadius: 4, marginBottom: 10, borderWidth: 1, borderColor: Colors.deckColor}} >
                  <View style={{width: deckWidth, height: deckHeight - 100}} >
                    <FlashList                        
                      data={images}
                      nestedScrollEnabled={true}                        
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={2}
                      estimatedItemSize={height}
                      renderItem={({item, index}: {item: string, index: number}) => {
                          return <Pressable onPress={() => setTempImageUrl(item)} >
                            <Image source={item} style={{width: width, height: height, marginTop: index >= 2 ? 10 : 0, marginRight: 10}} />
                          </Pressable>
                      }}/>
                  </View>                  
                </View>
                <View style={{width: '100%', height: 40, flexDirection: 'row', gap: 10, alignItems: "center", justifyContent: "center"}} >
                  {
                    isSaving ? 
                      <ActivityIndicator size={28} color={Colors.deckColor} /> :
                    <>
                      <Pressable onPress={cancelChanges} style={{flex: 1, height: 40, borderRadius: 4, backgroundColor: Colors.red, alignItems: "center", justifyContent: "center"}} >
                        <Text style={AppStyle.textRegular}>Cancel</Text>
                      </Pressable>
                      <Pressable onPress={saveChanges} style={{flex: 1, height: 40, borderRadius: 4, backgroundColor: Colors.deckColor, alignItems: "center", justifyContent: "center"}} >
                        <Text style={AppStyle.textRegular}>Save</Text>
                      </Pressable>
                    </>
                  }
                </View>
              </View>
            }
    </Animated.View>
  )
}

export default DeckCover

const styles = StyleSheet.create({})