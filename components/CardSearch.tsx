import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppConstants } from '@/constants/AppConstants'
import { supaFetchCards } from '@/lib/supabase'
import { Colors } from '@/constants/Colors'
import { Card } from '@/helpers/types'
import { debounce } from "lodash";
import { Image } from 'expo-image'
import CardGrid from './CardGrid'
import { Ionicons } from '@expo/vector-icons'
import CardPicker from './picker/CardPicker'
import { router } from 'expo-router'
import CustomFooter from './CustomGridFooter'


interface ItemProps {
    card: Card
    columns: number
    index: number
    width: number
    height: number
}


const Item = ({card, columns, index, width, height}: ItemProps) => {

    const handlePress = () => {
        Keyboard.dismiss()
        router.navigate({pathname: "/(pages)/cardPage", params: card})
    }
    
    return (
        <Pressable onPress={handlePress} >
            <Image 
                source={card.image_url} 
                contentFit='cover' 
                style={{width, height, marginTop: index >= columns ? 10: 0}}
                placeholder={AppConstants.blurhash}/>
        </Pressable>
    )
}


const GRID_COLUMNS = 3
var optionsMap = new Map<string, any>()
var searchText: string | null = null
var loading = false
var page = 0


const CardSearch = () => {
    
    const [cards, setCards] = useState<Card[]>([])
    const [hasResults, setHasResults] = useState(true)    
    const [dropDownPickerIsOpen, setDropDownPickerIsOpen] = useState(false)

    const fetch = async (append: boolean = false) => {        
        loading = true
        await supaFetchCards(
            searchText,
            optionsMap,
            page
        ).then(
            values => {
                setHasResults(values.length > 0)
                append 
                ? setCards((prev) => [...prev, ...values]) 
                : setCards([...values])
            }
        )        
        loading = false
    }

    const resetSearchOptions = () => {
        searchText = null
        page = 0
        optionsMap = new Map([
            ['sort', 'name'],
            ['sortDirection', 'ASC']
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

    const applyPicker = async () => {
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
                <CardPicker options={optionsMap} applyPicker={applyPicker} />
            </View>
            <CardGrid 
                cards={cards} 
                numColumns={GRID_COLUMNS} 
                Footer={CustomFooter}
                onEndReached={onEndReached} 
                RenderItem={Item}
                hasResults={hasResults}/>
        </View>
    )
}

export default CardSearch

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