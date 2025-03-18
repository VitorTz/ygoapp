import { ScrollView, Text, StyleSheet, View, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import CardCollection from '@/components/collection/CardCollection'
import DeckCollection from '@/components/collection/DeckCollection'
import TopBar from '@/components/TopBar'
import { supaGetSession } from '@/lib/supabase'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import LinkList, {ContainerData} from '@/components/LinkList'


const DATA: ContainerData[] = [
  {
    onPress: () => router.navigate("/deckCollectionPage"),
    color: Colors.deckColor,
    title: "Decks",
    imageKey: "DeckMonsterView"
  },
  {
    onPress: () => router.navigate("/cardCollectionPage"),
    color: Colors.cardColor,
    title: "Cards",
    imageKey: "CardMonsterView"
  },
]


const Collection = () => {

  const [userHasSession, setUserHasSession] = useState(true)  

  const init = async () => {
    const session = await supaGetSession()
    setUserHasSession(session != null)    
  }

  useEffect(
    () => {
        init()
    },
    []
  )

  return (
    <SafeAreaView style={AppStyle.safeArea}>
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}} >
        <TopBar title='Collection'/>
        <LinkList data={DATA}/>
      </View>
    </SafeAreaView>
  )
}


export default Collection

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    gap: 20, 
    alignItems: "center", 
    justifyContent: "center"
  }
})