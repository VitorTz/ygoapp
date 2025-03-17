import { Pressable, ScrollView, TextInput, SafeAreaView, StyleSheet, Text, View, Switch, Keyboard, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { wp, hp, getImageHeight, showToast, orderCards, sleep } from '@/helpers/util'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import TopBar from '@/components/TopBar'
import { Card } from '@/helpers/types'
import CardPool from '@/components/CardsPool'
import { supaCreateDeck, supaFetchCards } from '@/lib/supabase'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { Image } from 'expo-image'
import { useCallback } from 'react'
import { debounce } from 'lodash'
import { FlatList } from 'react-native'
import { AppConstants } from '@/constants/AppConstants'
import { Ionicons } from '@expo/vector-icons'
import CardPicker from '@/components/picker/CardPicker'
import Toast from 'react-native-toast-message'
import CardGrid from '@/components/grid/CardGrid'
import { router } from 'expo-router'



const schema = yup.object().shape({  
    name: yup
        .string()
        .min(3, 'Name must be at least 3 characters')
        .required('Email is required'),
    description: yup
        .string()
        .max(1000, 'Max 1000 characters')
        .default('')
});


interface FormData {
  name: string
  description: string
}


const CardInfo = ({title, value}: {title: string, value: any}) => {
    return (
        <>
            {
                value &&                 
                <View style={{marginRight: 10}} >
                    <Text style={AppStyle.textHeader} >{title}</Text>
                    <Text style={AppStyle.textRegular} >{value}</Text>
                </View>                
            }
        </>
    )
}


const CardComponent = ({
  card, 
  closeCardComponent,
  numCardsOnDeck,
  addCard,
  rmvCard,
}: {
  card: Card, 
  closeCardComponent: () => void,
  addCard: (card: Card) => void,
  rmvCard: (card: Card) => void,
  numCardsOnDeck: number
}) => {

  const [copiesOnDeck, setCopiesOnDeck] = useState(numCardsOnDeck)
  const cardWidth = wp(90)
  const cardHeight = getImageHeight(cardWidth)
  
  const card_info = [
      {value: card.attack, title: 'Attack'},
      {value: card.defence, title: 'Defence'},
      {value: card.level, title: 'Level'},
      {value: card.attribute, title: 'Attribute'},
      {value: card.archetype, title: 'Archetype'},
      {value: card.frametype, title: 'Frametype'},
      {value: card.race, title: 'Race'},
      {value: card.type, title: 'Type'}
  ]

  const add = async () => {
    setCopiesOnDeck(prev => prev <= 2 ? prev + 1 : prev)
    await addCard(card)
  }

  const rmv = async () => {
    setCopiesOnDeck(prev => prev > 0 ? prev - 1 : prev)
    await rmvCard(card)
  }

  return (
    <Animated.View 
      entering={FadeIn.duration(500)} 
      style={{
        position: 'absolute', 
        top: 0,
        width: wp(100),
        height: hp(100),
        padding: wp(5), 
        backgroundColor: Colors.background,                
      }}>
        <ScrollView style={{flex: 1}} >    
          <View style={{flex: 1, gap: 10}}>            
            <View style={{width: '100%', flexDirection: 'row', justifyContent: "flex-end"}} >
              <Pressable onPress={closeCardComponent} hitSlop={AppConstants.hitSlopLarge} >
                <Ionicons name='close-circle-outline' size={42} color={Colors.cardColor} />
              </Pressable>
            </View>
            <Image style={{width: cardWidth, height: cardHeight}} source={card.image_url} />
            <View style={{width: '100%', padding: wp(5), backgroundColor: Colors.gray, borderRadius: 4, borderWidth: 1, borderColor: Colors.accentColor, gap: 10}} >

              <FlatList
                  data={card_info}
                  keyExtractor={(item) => item.title}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => <CardInfo title={item.title} value={item.value} />}
              />
              
              <View style={{width: '100%', gap: 10}} >
                <Text style={AppStyle.textHeader}>Description</Text>
                <Text style={AppStyle.textRegular}>{card.descr}</Text>
              </View>
        
              <Text style={AppStyle.textHeader}>Copies on deck: {copiesOnDeck}</Text>            

              <View style={{width: '100%', flexDirection: 'row', gap: 20}} >
                <Pressable onPress={rmv} style={{flex: 1, height: 50, borderRadius: 4, alignItems: "center", justifyContent: "center", backgroundColor: Colors.cardColor}} >
                  <Ionicons name='remove-outline' size={32} color={Colors.white} />
                </Pressable>
                <Pressable onPress={add} style={{flex: 1, height: 50, borderRadius: 4, alignItems: "center", justifyContent: "center", backgroundColor: Colors.cardColor}} >
                  <Ionicons name='add-outline' size={32} color={Colors.white} />
                </Pressable>
              </View>
            </View>

          </View>
        </ScrollView>
    </Animated.View>
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

interface SearchCardsProps {
  onCardPress: (card: Card) => void
  
}

const SearchCards = ({ openCardComponent }: {
  openCardComponent: (card: Card) => void  
}) => {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [hasResult, setHasResults] = useState(true)
  const [filterIsOpened, setFilterOpened] = useState(false)
  const inputRef = useRef<TextInput | null>(null)  

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

  const onEndReached = async () => {
    console.log("end")    
    debounceSearch(searchTerm, true)
  }

  const debounceSearch = useCallback(
    debounce(handleSearch, 400),
    []
  )

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
                <Ionicons name='close-outline' size={32} color={Colors.white} /> :
                <Ionicons name='options-outline' size={32} color={Colors.white} />
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


const CreateDeck = () => {

  const [loading, setLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [cardsOnDeck, setCardsOnDeck] = useState<Card[]>([])
  const [cardToDisplay, setCardToDisplay] = useState<Card | null>(null)
  const cardsMap = useRef<Map<number, number>>(new Map())

  const {
      control,
      handleSubmit,
      formState: { errors },
  } = useForm<FormData>({
      resolver: yupResolver(schema),
      defaultValues: {            
          name: '',
          description: '',
      },
  });

  const init = async () => {
    resetOptions()
  }

  useEffect(
    () => {
        init()
    },
    []
  )

  const toggleSwitch = () => {
      setIsPublic(prev => !prev)
  }

  const onSubmit = async (formData: FormData) => {    
    if (cardsOnDeck.length == 0) {
      showToast("Error", "Your deck has 0 cards", "error")
      return
    }
    setLoading(true)
    const success = await supaCreateDeck(formData.name, formData.description, isPublic, cardsOnDeck)
    if (!success) {
      showToast("Error", "Could not create deck", "error")
    } else {
      showToast("Success!", `Deck ${formData.name.trimEnd()} created!`, "success")
      await sleep(400)
      router.back()
    }
    setLoading(false)
  }

  const getNumCardsOnDeck = (card: Card) => {
    return cardsMap.current.get(card.card_id) ? cardsMap.current.get(card.card_id)! : 0
  }

  const addCardToDeck = async (card: Card) => {
    const n: number = getNumCardsOnDeck(card)
    if (n >= 3) {
      showToast("Warning", "Max 3 cards", "info")
      return
    }
    cardsMap.current.set(card.card_id, n + 1)    
    setCardsOnDeck(prev => orderCards([...prev, ...[card]]))
  }

  const rmvCardFromDeck = async (card: Card) => {
    const n: number = getNumCardsOnDeck(card)
    if (n == 0) {
      showToast("Warning", "0 cards on deck", "info")
      return
    }
    cardsMap.current.set(card.card_id, n - 1)
    
    setCardsOnDeck(
      prev => {
        let find = false
        return prev.filter(
          (value, index, array) => {
            if (value.card_id != card.card_id) {
              return true
            }
            if (find == true) {
              return true
            }
            find = true
            return false
          }
        )
      }
    )
  }

  const openCardComponent = (card: Card) => {
    Keyboard.dismiss()
    setCardToDisplay(card)
  }

  const closeCardComponent = () => {
    setCardToDisplay(null)
  }

  return (
    <SafeAreaView style={AppStyle.safeArea} >
      <ScrollView style={{width: '100%'}} nestedScrollEnabled={true}>
        <TopBar title='Create deck' buttonColor={Colors.deckColor} />
        <View style={{width: '100%', gap: 10}} >
          <Text style={[AppStyle.textHeader, {color: Colors.white}]} >Name</Text>                    
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}                  
                    onChangeText={onChange}
                    value={value}/>
                )}
            />
            {errors.name && (<Text style={AppStyle.errorMsg}>{errors.name.message}</Text>)}
          <Text style={[AppStyle.textHeader, {color: Colors.white}]} >Description</Text>
          <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                  style={[styles.input, {height: hp(18), textAlignVertical: "top"}]}
                  onBlur={onBlur}
                  multiline={true}
                  onChangeText={onChange}
                  value={value}/>
              )}
          />
          {errors.description && (<Text style={AppStyle.errorMsg}>{errors.description.message}</Text>)}

          <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "flex-start"}} >
              <Text style={AppStyle.textRegular}>Is public?</Text>
              <Switch
                trackColor={{false: '#767577', true: Colors.gray1}}
                thumbColor={isPublic ? Colors.deckColor : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isPublic}/>
          </View>

          <Pressable onPress={handleSubmit(onSubmit)} style={{width: '100%', justifyContent: "center", alignItems: "center", height: 50, borderRadius: 4, backgroundColor: Colors.deckColor}} >
            {
              loading ? 
              <ActivityIndicator size={32} color={Colors.white} /> :
              <Text style={[AppStyle.textRegular, {fontSize: 20}]}>Create</Text>
            }
          </Pressable>

          <CardPool 
            cardsOnPool={cardsOnDeck} 
            onCardPress={openCardComponent}
            color={Colors.deckColor}/>

          <SearchCards openCardComponent={openCardComponent}/>

        </View>
      </ScrollView>
      {
        cardToDisplay && 
        <CardComponent 
          numCardsOnDeck={getNumCardsOnDeck(cardToDisplay)}
          closeCardComponent={closeCardComponent} 
          card={cardToDisplay} 
          addCard={addCardToDeck} 
          rmvCard={rmvCardFromDeck}/>
      }
      <Toast/>
    </SafeAreaView>
  )
}

export default CreateDeck

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