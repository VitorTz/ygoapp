import {     
    Pressable, 
    SafeAreaView, 
    StyleSheet,     
    TextInput, 
    View 
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import { fetchCards } from '@/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { Card } from '@/helpers/types'
import { debounce } from 'lodash'
import CardPicker from '@/components/picker/CardPicker'
import BackButton from '@/components/BackButton'
import CardGrid from '@/components/grid/CardGrid'
import { AppConstants } from '@/constants/AppConstants'
import TopBar from '@/components/TopBar'


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
    const [hasResults, setHasResults] = useState(true)
    const [filterIsOpened, setFilterOpened] = useState(false)
    const inputRef = useRef<TextInput>(null)

    const init = async () => {
        setLoading(true)
        inputRef.current?.clear()
        resetOptions()
        await fetchCards(searchTerm, options, page)
            .then(value => {
                setHasResults(value.length > 0)
                setCards([...value])
            })
        setLoading(false)
    }

    useEffect(() => {    
        init()
    }, [])

    const handleSearch = async (input: string | null, append: boolean = false) => {
        setLoading(true)
        searchTerm = input ? input.trimEnd() : null
        page = append ? page + 1 : 0
        await fetchCards(searchTerm, options, page)
            .then(value => {
                setHasResults(value.length > 0)
                append ? setCards(prev => [...prev, ...value]) : setCards([...value])
            })
        setLoading(false)
    }

    const debounceSearch = useCallback(
        debounce(handleSearch, 400),
        []
    )

    const onEndReached = async () => {  
        if (!hasResults) { return }
        debounceSearch(searchTerm, true)
    }

    const toggleFilter = () => {
        setFilterOpened(prev => !prev)
    }

    const applyFilter = async () => {
        await debounceSearch(searchTerm)
    }

    return (
        <SafeAreaView style={AppStyle.safeArea} >            
            <TopBar title='Card Database'>
                <BackButton color={Colors.red} />
            </TopBar>
            <View style={{flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: "center", justifyContent: "center"}} >
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
                        <Ionicons name='close-outline' size={28} color={Colors.cardColor} /> :
                        <Ionicons name='options-outline' size={28} color={Colors.cardColor} />
                    }
                </Pressable>
            </View>
            <View style={{width: '100%', display: filterIsOpened ? "flex" : "none"}} >
                <CardPicker options={options} applyPicker={applyFilter}/>
            </View>
            <CardGrid 
                cards={cards} 
                hasResults={hasResults} 
                loading={loading} 
                numColumns={4} 
                gap={20}
                onEndReached={onEndReached}/>            
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