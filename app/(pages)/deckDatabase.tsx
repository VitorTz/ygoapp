import { Pressable, ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { AppStyle } from '@/style/AppStyle'
import { Image } from 'expo-image'
import { AppConstants } from '@/constants/AppConstants'
import { router } from 'expo-router'
import { getImageHeightCropped, hp, wp } from '@/helpers/util'
import { Deck } from '@/helpers/types'
import { MasonryFlashList } from '@shopify/flash-list'
import { supaFetchDecks } from '@/lib/supabase'


const GRID_COLUMNS = 1
const DECK_WIDTH = wp(90)
const DECK_HEIGHT = getImageHeightCropped(DECK_WIDTH)


const RenderDeck = ({deck}: {deck: Deck}) => {
  return (
    <View style={{marginBottom: 20}}>
      <Image source={deck.image_url} style={{width: DECK_WIDTH, height: DECK_HEIGHT}} contentFit='cover' />
      <View style={{width: '100%', padding: 20, borderTopWidth: 2, borderColor: Colors.purple, backgroundColor: Colors.gray}} >
        <Text style={[AppStyle.textRegular, {fontSize: hp(2.8)}]}>{deck.name}</Text>
        <Text style={[AppStyle.textRegular, {fontSize: hp(2)}]}>Type: {deck.type}</Text>
        <Text style={[AppStyle.textRegular, {fontSize: hp(2)}]}>Cards: {deck.num_cards}</Text>
      </View>
    </View>

  )
}


const Footer = ({loading}: {loading: boolean}) => {
    return (
        <>
            {
                loading &&
                <View style={{width: '100%', padding: 20, alignItems: "center", justifyContent: "center"}} >
                    <ActivityIndicator size={40} color={Colors.purple}/>
                </View>
            }
        </>
    )
}

const DeckGrid = ({decks, loading}: {decks: Deck[], loading: boolean}) => {

  const onEndReached = async () => {

  }
  

  return (
    <View style={{width: '100%', flex: 1, height: hp(100)}} >
      <MasonryFlashList
        data={decks}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={DECK_HEIGHT}
        keyboardShouldPersistTaps={"handled"}
        numColumns={GRID_COLUMNS}          
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<Footer loading={loading} />}
        renderItem={({item}) => <RenderDeck deck={item} />}
        />
    </View>
  )
}


var searchTerm: string | null = null
var options: Map<string, any>  = new Map()
var page = 0

const resetOptions = () => {
  searchTerm = null
  page = 0
  options = new Map<string, any>([
      ['archetypes', []],
      ['attributes', []],
      ['frametypes', []],
      ['races', []],
      ['types', []],
      ['deckType', 'TCG']
  ])
}

const DeckDatabase = () => {


  const [decks, setDecks] = useState<Deck[]>([])    
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const init = async () => {
    setLoading(true)
    resetOptions()
    await supaFetchDecks(
      searchTerm, 
      options, 
      page
    ).then(value => setDecks([...value]))
    setLoading(false)
  }

  useEffect(() => {    
    init()
  }, [])

  const handleSearch = (input: string) => {

  }

  const toggleFilter = () => {

  }

  return (
    <SafeAreaView style={[AppStyle.safeArea]} >
        <View style={{flex: 1, gap: 30, alignItems: "center", padding: 20}} >
          <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}} >
            <Text style={[AppStyle.textRegular, {fontSize: 32}]}>Deck Database</Text>
            <Pressable onPress={() => router.back()} hitSlop={AppConstants.hitSlopLarge} >
              <Ionicons name='return-down-back-outline' size={40} color={Colors.purple} />
            </Pressable>
          </View>
          <View style={{flexDirection: 'row', gap: 10, alignItems: "center", justifyContent: "center"}} >
            <TextInput
              ref={inputRef}
              style={styles.input}            
              onChangeText={text => handleSearch(text)}
              placeholder='search'
              placeholderTextColor={Colors.white}
            />
            <Pressable onPress={toggleFilter} style={{position: 'absolute', right: 10}}>
              <Ionicons name='options-outline' size={40} color={Colors.purple} />
            </Pressable>
          </View>
          <DeckGrid decks={decks} loading={loading}/>
        </View>
    </SafeAreaView>
  )
}

export default DeckDatabase

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.gray,
    borderRadius: 4,
    fontFamily: "LeagueSpartan_400Regular",
    paddingLeft: 10,
    color: Colors.white,
    flex: 1,
    fontSize: 18
  }
})