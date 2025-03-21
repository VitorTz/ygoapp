import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import TopBar from '@/components/TopBar'
import { router } from 'expo-router'
import { View } from 'react-native'
import React from 'react'
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