import { StyleSheet, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import TopBar from '@/components/TopBar'
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