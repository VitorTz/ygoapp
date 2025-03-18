import { 
  Keyboard,
  Pressable, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View 
} from 'react-native'
import { Colors } from '@/constants/Colors'
import React, { useEffect, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { AppStyle } from '@/style/AppStyle'
import { Deck } from '@/helpers/types'
import { supaFetchDecks } from '@/lib/supabase'
import BackButton from '@/components/BackButton'
import DeckGrid from '@/components/grid/DeckGrid'
import TopBar from '@/components/TopBar'
import { router } from 'expo-router'



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
      ['deckType', 'Any']
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

  const onDeckPress = (deck: Deck) => {
    Keyboard.dismiss()
    router.navigate({pathname: "/deckPage", params: deck as any})
  }

  return (
    <SafeAreaView style={AppStyle.safeArea} >        
      <TopBar title='Deck Database'>
        <BackButton color={Colors.deckColor} />
      </TopBar>
      <View style={{flexDirection: 'row', marginBottom: 10, gap: 10, alignItems: "center", justifyContent: "center"}} >
        <TextInput
          ref={inputRef}
          style={styles.input}            
          onChangeText={text => handleSearch(text)}
          placeholder='search'
          placeholderTextColor={Colors.white}
        />
        <Pressable onPress={toggleFilter} style={{position: 'absolute', right: 10}}>
          <Ionicons name='options-outline' size={40} color={Colors.deckColor} />
        </Pressable>
      </View>
      <DeckGrid 
        decks={decks} 
        hasResult={true} 
        loading={loading} 
        columns={2}
        gap={30}
        onDeckPress={onDeckPress}/>
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