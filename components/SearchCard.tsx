import { StyleSheet, TextInput, Pressable, Text, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { AppConstants } from '@/constants/AppConstants'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import { useRef } from 'react'
import { wp, hp } from '@/helpers/util'
import { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import CardPicker from './picker/CardPicker'
import { useState } from 'react'
import CardGrid from './grid/CardGrid'
import React from 'react'
import { Card } from '@/helpers/types'
import { supaFetchCards } from '@/lib/supabase'


var searchTerm: string | null = null
var options: Map<string, any>  = new Map()
var page = 0


const resetOptions = () => {
    searchTerm = null
    page = 0
    options = new Map([
        ['sort', 'name'],
        ['sortDirection', 'ASC']
    ])
}

interface SearchCardInterfaceProps {
  openCardComponent: (card: Card) => void
  color?: string
}

const SearchCard = ({ openCardComponent, color = Colors.white }: SearchCardInterfaceProps) => {
    const [cards, setCards] = useState<Card[]>([])
    const [loading, setLoading] = useState(false)
    const [hasResult, setHasResults] = useState(true)
    const [filterIsOpened, setFilterOpened] = useState(false)
    const inputRef = useRef<TextInput | null>(null)  
  
    const init = async () => {
        setLoading(true)
        resetOptions()
        inputRef.current?.clear()
        resetOptions()
        await supaFetchCards(
            searchTerm, 
            options, 
            page
        ).then(value => setCards([...value]))
        setLoading(false)
    }
    
    useEffect(() => {
      init()
    }, [])
  
    const handleSearch = async (input: string | null, append: boolean = false) => {
      setLoading(true)
      searchTerm = input ? input.trimEnd() : null
      page = append ? page + 1 : 0
      await supaFetchCards(
          searchTerm,
          options,
          page
      ).then(value => append ? setCards(prev => [...prev, ...value]) : setCards([...value]))
      setLoading(false)
    }
  
    const debounceSearch = useCallback(
      debounce(handleSearch, 400),
      []
    )
    
    const onEndReached = async () => {
      debounceSearch(searchTerm, true)
    }

    const toggleFilter = () => {
      setFilterOpened(prev => !prev)
    }
    
    const applyFilter = async () => {    
      debounceSearch(searchTerm)
    }
  
    return (
      <View style={{
          width: '100%', 
          borderRadius: 4, 
          borderWidth: 1, 
          borderColor: Colors.deckColor, 
          gap: 10,
          alignItems: "center",        
          height: hp(100)
        }} >
        <View style={styles.header} >
          <Text style={[AppStyle.textRegular, {fontSize: hp(2.8)}]} >Card Database</Text>        
        </View>
  
        <View style={{width: '100%', flexDirection: 'row', paddingHorizontal: 10, gap: 10, marginBottom: 10, alignItems: "center", justifyContent: "center"}} >
          <TextInput
          ref={inputRef}
          style={styles.input}            
          onChangeText={debounceSearch}
          placeholder='search'
          placeholderTextColor={Colors.white}/>
          <Pressable 
              onPress={toggleFilter} 
              style={{position: 'absolute', right: 20}} 
              hitSlop={AppConstants.hitSlopLarge}>
              {
                  filterIsOpened ?
                  <Ionicons name='close-outline' size={32} color={color} /> :
                  <Ionicons name='options-outline' size={32} color={color} />
              }
          </Pressable>
        </View>
        <View style={{width: '100%', paddingHorizontal: 10, display: filterIsOpened ? "flex" : "none"}} >
          <CardPicker listMode="MODAL" options={options} applyPicker={applyFilter} accentColor={Colors.deckColor}/>
        </View>
        <CardGrid
          cards={cards}
          hasResults={hasResult}
          loading={loading}
          numColumns={4}
          gap={20}
          onEndReached={onEndReached}
          onCardPress={openCardComponent}/>
  
      </View>
    )
  }
  

export default SearchCard

const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 10,
        width: '100%',
        color: Colors.white,
        height: 50,
        borderRadius: 4,
        backgroundColor: Colors.gray
    },
    header: {
        width: '100%', 
        flexDirection: 'row', 
        alignItems: "center", 
        height: hp(6),        
        justifyContent: "space-between", 
        paddingHorizontal: wp(2),
        backgroundColor: Colors.deckColor
    }
})