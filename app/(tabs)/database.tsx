import LinkList, { ContainerData } from '@/components/LinkList'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import React from 'react'
import TopBar from '@/components/TopBar'


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
    onPress: () => router.navigate("/(pages)/limitedCards"),
    color: Colors.limitedColor,
    title: "Limited & Forbidden List",
    imageKey: "LimitedMonsterView"
  },
  {
    onPress: () => {},
    color: Colors.mediumGray,
    title: "Manga",
    imageKey: "MangaView"
  }
]

const Database = () => {
  return (
    <SafeAreaView style={AppStyle.safeArea}>
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}} >
        <TopBar title='Database'/>
        <LinkList data={DATA}/>
      </View>
    </SafeAreaView>
  )
}

export default Database
