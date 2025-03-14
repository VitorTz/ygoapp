import { 
    ActivityIndicator, 
    Pressable, 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    TextInput, 
    View 
} from 'react-native'
import { API_CARD_HEIGHT, API_CARD_WIDTH, AppConstants } from '@/constants/AppConstants'
import { getItemGridDimensions, hp } from '@/helpers/util'
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import { MasonryFlashList } from '@shopify/flash-list'
import { supaFetchCards } from '@/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { Card } from '@/helpers/types'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { debounce } from 'lodash'
import CardPicker from '@/components/picker/CardPicker'

const GRID_COLUMNS = 4
const {width: CARD_WIDTH, height: CARD_HEIGHT} = getItemGridDimensions(
    10,
    20,
    4,
    API_CARD_WIDTH,
    API_CARD_HEIGHT
)


const RenderCard = ({card}: {card: Card}) => {
  return (
    <View style={{marginBottom: 20}}>
      <Image source={card.image_url} style={{width: CARD_WIDTH, height: CARD_HEIGHT}} contentFit='cover' />      
    </View>

  )
}


const Footer = ({loading}: {loading: boolean}) => {
    return (
        <>
            {
                loading &&
                <View style={{width: '100%', padding: 20, alignItems: "center", justifyContent: "center"}} >
                    <ActivityIndicator size={40} color={Colors.red}/>
                </View>
            }
        </>
    )
}


const CardGrid = ({cards, loading}: {cards: Card[], loading: boolean}) => {

  const onEndReached = async () => {

  } 

  return (
    <View style={{width: '100%', flex: 1, height: hp(100)}} >
      <MasonryFlashList
        data={cards}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={CARD_HEIGHT}
        keyboardShouldPersistTaps={"handled"}
        numColumns={GRID_COLUMNS}          
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<Footer loading={loading} />}
        renderItem={({item}) => <RenderCard card={item} />}
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
    options = new Map([
        ['sort', 'name'],
        ['sortDirection', 'ASC']
    ])
}


const CardDatabase = () => {

    const [cards, setCards] = useState<Card[]>([])
    const [loading, setLoading] = useState(false)
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

    }

    return (
        <SafeAreaView style={[AppStyle.safeArea]} >
            <View style={{flex: 1, gap: 30, alignItems: "center", padding: 20}} >
            <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}} >
                <Text style={[AppStyle.textRegular, {fontSize: 32}]}>Card Database</Text>
                <Pressable onPress={() => router.back()} hitSlop={AppConstants.hitSlopLarge} >
                    <Ionicons name='return-down-back-outline' size={40} color={Colors.red} />
                </Pressable>
            </View>
            <View style={{flexDirection: 'row', gap: 10, alignItems: "center", justifyContent: "center"}} >
                <TextInput
                ref={inputRef}
                style={styles.input}            
                onChangeText={debounceSearch}
                placeholder='search'
                placeholderTextColor={Colors.white}/>
                <Pressable onPress={toggleFilter} style={{position: 'absolute', right: 10}}>
                    <Ionicons name='chevron-down-circle' size={32} color={Colors.red} />
                </Pressable>
            </View>
                <CardGrid cards={cards} loading={loading}/>
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
    borderRadius: 4,
    fontFamily: "LeagueSpartan_400Regular",
    paddingLeft: 10,
    color: Colors.white,
    flex: 1,
    fontSize: 18
  }
})