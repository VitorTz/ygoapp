import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import LinkList, { ContainerData } from '@/components/LinkList'


const DATA: ContainerData[] = [
  {
    onPress: () => router.navigate("/deckDatabase"),
    color: Colors.deckColor,
    title: "Decks",
    imageKey: "DeckMonsterView"
  },
  {
    onPress: () => router.navigate("/cardDatabase"),
    color: Colors.cardColor,
    title: "Cards",
    imageKey: "CardMonsterView"
  },
  {
    onPress: () => {},
    color: Colors.packColor,
    title: "Packs",
    imageKey: "PackMonsterView"
  },
  {
    onPress: () => {},
    color: Colors.limitedColor,
    title: "Limited & Forbidden List",
    imageKey: "LimitedMonsterView"
  },
  {
    onPress: () => {},
    color: Colors.black,
    title: "Manga",
    imageKey: "MangaView"
  }
]

const Database = () => {
  return (
    <SafeAreaView style={AppStyle.safeArea}>
      <View style={{flex: 1, gap: 10, alignItems: "center"}} >
        <View style={{width: '100%', paddingHorizontal: 20, paddingVertical: 10, alignItems: "flex-start"}} >
          <Text style={[AppStyle.textRegular, {fontSize: 32}]}>Database</Text>          
        </View>
        <LinkList data={DATA}/>
      </View>
    </SafeAreaView>
  )
}

export default Database

const styles = StyleSheet.create({

})