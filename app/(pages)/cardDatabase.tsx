import {     
    Pressable, 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    TextInput, 
    View 
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import { supaFetchCards } from '@/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { Card } from '@/helpers/types'
import { debounce } from 'lodash'
import CardPicker from '@/components/picker/CardPicker'
import BackButton from '@/components/BackButton'
import CardGrid from '@/components/grid/CardGrid'
import { AppConstants } from '@/constants/AppConstants'


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


const CardDatabase = () => {

    const [cards, setCards] = useState<Card[]>([])
    const [loading, setLoading] = useState(false)
    const [filterIsOpened, setFilterOpened] = useState(false)
    const inputRef = useRef<TextInput>(null)

    const init = async () => {
        setLoading(true)
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

    const handleSearch = async (input: string | null) => {        
        searchTerm = input ? input.trimEnd() : null
        page = 0
        await supaFetchCards(
            searchTerm,
            options,
            page
        ).then(value => setCards([...value]))    
    }

    const debounceSearch = useCallback(
        debounce(handleSearch, 400),
        []
    )

    const toggleFilter = () => {
        setFilterOpened(prev => !prev)
    }

    const applyFilter = async () => {
        await debounceSearch(searchTerm)
    }

    return (
        <SafeAreaView style={[AppStyle.safeArea]} >
            <View style={{flex: 1, gap: 20, alignItems: "center", padding: 20}} >
            <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}} >
                <Text style={[AppStyle.textRegular, {fontSize: 32}]}>Card Database</Text>
                <BackButton color={Colors.cardColor}/>
            </View>
            <View style={{flexDirection: 'row', gap: 10, alignItems: "center", justifyContent: "center"}} >
                <TextInput
                ref={inputRef}
                style={styles.input}            
                onChangeText={debounceSearch}
                placeholder='search'
                placeholderTextColor={Colors.white}/>
                <Pressable 
                    onPress={toggleFilter} 
                    style={{position: 'absolute', right: 10}} 
                    hitSlop={AppConstants.hitSlopLarge}>
                    {
                        filterIsOpened ?
                        <Ionicons name='close-outline' size={32} color={Colors.cardColor} /> :
                        <Ionicons name='options-outline' size={32} color={Colors.cardColor} />
                    }
                </Pressable>
            </View>
                <View style={{width: '100%', display: filterIsOpened ? "flex" : "none"}} >
                    <CardPicker options={options} applyPicker={applyFilter} accentColor={Colors.cardColor}/>
                </View>
                <CardGrid 
                    cards={cards} 
                    hasResults={true} 
                    loading={loading} 
                    numColumns={4} 
                    gap={20}/>
            </View>
        </SafeAreaView>
    )
}

export default CardDatabase

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.gray,
    borderRadius: 10,
    fontFamily: "LeagueSpartan_400Regular",
    paddingLeft: 10,
    color: Colors.white,
    flex: 1,
    fontSize: 18
  }
})