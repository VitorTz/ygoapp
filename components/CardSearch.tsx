import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppConstants } from '@/constants/AppConstants'
import { supaFetchCards } from '@/lib/supabase'
import { Colors } from '@/constants/Colors'
import { Card } from '@/helpers/types'
import { debounce } from "lodash";
import { Image } from 'expo-image'
import CardGrid from './CardGrid'
import { LeagueSpartan_400Regular } from '@expo-google-fonts/league-spartan'


const CustomFooter = ({hasResults}: {hasResults: boolean}) => {
    return (
        <View style={{width: '100%', alignItems: "center", marginTop: 10}} >
            {
                hasResults &&
                <ActivityIndicator size={32} color={Colors.orange} />
            }
        </View>
    )
}


interface ItemProps {
    card: Card
    columns: number
    index: number
    width: number
    height: number
}


const Item = ({card, columns, index, width, height}: ItemProps) => {

    const handlePress = () => {
        console.log(card.name)
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

const CardSearch = () => {
    
    const [cards, setCards] = useState<Card[]>([])
    const [hasResults, setHasResults] = useState(true)
    const optionsMap = useRef(new Map<string, any>())
    const searchText = useRef<string | null>(null)
    const loading = useRef(false)
    const page = useRef(0)    

    const fetch = async (append: boolean = false) => {
        console.log("Fetch", page.current, append)
        loading.current = true
        const newCards = await supaFetchCards(
            searchText.current,
            optionsMap.current,
            page.current
        )
        setHasResults(newCards.length > 0)
        append 
            ? setCards((prevCards) => [...prevCards, ...newCards]) 
            : setCards([...newCards])
        loading.current = false
    }


    const resetSearchOptions = () => {
        searchText.current = null
        page.current = 0
        optionsMap.current = new Map([
            ['sort', 'name'],
            ['sortDirection', 'ASC']
        ])
    }

    const init = async () => {  
        resetSearchOptions()
        await fetch()
    }

    const handleSearch = async (input: string | null) => {
        console.log(input)
        searchText.current = input ? input.trimEnd() : null
        page.current = 0
        await fetch()
    }

    const debounceSearch = useCallback(
        debounce(handleSearch, 400),
        []
    )

    const onEndReached = useCallback(async () => {        
        if (!loading.current && hasResults) {
            page.current += 1
            await fetch(true)            
        }
      }, []
    );

    useEffect(
        useCallback(() => {
            console.log("ini")
            init()
        }, []),
        []
    )

    return (
        <View style={{flex: 1, width: '100%', gap: 10}} >
            <View style={{width: '100%'}} >
                <TextInput
                    style={styles.input}
                    placeholder='search'
                    onChangeText={debounceSearch}
                    placeholderTextColor={Colors.white}
                />
            </View>
            <CardGrid 
                cards={cards} 
                numColumns={3} 
                Footer={CustomFooter}
                onEndReached={onEndReached} 
                RenderItem={Item}
                hasResults={hasResults}
            />
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