import { StyleSheet, Platform, Pressable, KeyboardAvoidingView, TextInput, Keyboard, Text, View } from 'react-native'
import CardGrid from './CardGrid'
import { AppConstants } from '@/constants/AppConstants'
import { Image } from 'expo-image'
import DeckCard from './DeckCard'
import { useState, useEffect, useCallback } from 'react'
import { useRef } from 'react'
import { supaFetchDecks } from '@/lib/supabase'
import DeckPicker from './picker/DeckPicker'
import { Deck } from '@/helpers/types'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { debounce } from 'lodash'
import { router } from 'expo-router'
import DeckGrid from './DeckGrid'
import React from 'react'
import CustomFooter from './CustomGridFooter'



interface ItemProps {
    deck: Deck
    columns: number
    index: number
    width: number
    height: number
}




const GRID_COLUMNS = 2
var optionsMap = new Map<string, any>()
var searchText: string | null = null
var loading = false
var page = 0


const DeckSearch = () => {

    const [decks, setDecks] = useState<Deck[]>([])
    const [hasResults, setHasResults] = useState(true)    
    const [dropDownPickerIsOpen, setDropDownPickerIsOpen] = useState(false)



    const fetch = async (append: boolean = false) => {    
        loading = true
        await supaFetchDecks(
            searchText, 
            optionsMap, 
            page
        ).then(
            value => {
                setHasResults(value.length > 0)        
                append ? setDecks((prev) => [...prev, ...value]) : setDecks([...value])
            }
        )
        loading = false
    }

    const resetSearchOptions = () => {
        searchText = null
        page = 0
        optionsMap = new Map<string, any>([
            ['archetypes', []],
            ['attributes', []],
            ['frametypes', []],
            ['races', []],
            ['types', []],
            ['deckType', 'TCG']
        ])
    }

    const init = async () => {
        resetSearchOptions()
        await fetch()
    }

    const handleSearch = async (input: string | null) => {        
        searchText = input ? input.trimEnd() : null
        page = 0
        await fetch()
    }
    
    const debounceSearch = useCallback(
        debounce(handleSearch, 400),
        []
    )

    const onEndReached = useCallback(async () => {        
        if (!loading && hasResults) {
            page += 1
            await fetch(true)            
        }
        }, []
    );
  
    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )
    
    const toggleDropDownPicker = () => {
        Keyboard.dismiss()
        setDropDownPickerIsOpen(prev => !prev)
    }

    const applyFilter = async () => {
        await debounceSearch(searchText)
    }

    return (
        <View style={{flex: 1, width: '100%', gap: 10}} >
            <View style={{width: '100%'}} >
                <TextInput
                    style={styles.input}
                    placeholder='search'
                    onChangeText={debounceSearch}
                    placeholderTextColor={Colors.white}/>
                <Pressable onPress={toggleDropDownPicker} style={{position: 'absolute', right: 10, alignItems: "center", justifyContent: "center", top: 0, bottom: 0}} hitSlop={AppConstants.hitSlopLarge} >
                    {
                        dropDownPickerIsOpen ?
                        <Ionicons name='caret-up-circle' size={28} color={Colors.orange} /> :
                        <Ionicons name='caret-down-circle' size={28} color={Colors.orange} />
                    }
                </Pressable>
            </View>
            <View style={{display: dropDownPickerIsOpen ? 'flex' : 'none'}} >
                <DeckPicker applyFilter={applyFilter} options={optionsMap}/>
            </View>
            <DeckGrid
                columns={GRID_COLUMNS}
                decks={decks}
                hasResult={hasResults}
                onEndReached={onEndReached}/>
        </View>        
    )
}

export default DeckSearch

const styles = StyleSheet.create({
    input: {    
        width: '100%', 
        fontFamily: "LeagueSpartan_400Regular",
        color: Colors.white,
        fontSize: 16,
        height: 50, 
        paddingLeft: 10,
        paddingRight: 40,
        backgroundColor: Colors.gray, 
        borderRadius: 4
    }
})