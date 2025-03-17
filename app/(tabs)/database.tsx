import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { wp } from '@/helpers/util'
import LinkList, { ContainerData } from '@/components/LinkList'
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
    onPress: () => {},
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
    <SafeAreaView style={[AppStyle.safeArea, {paddingHorizontal: 0}]}>
      <View style={{width: '100%', paddingHorizontal: wp(5)}} >
        <TopBar title='Database'/>
      </View>
      <LinkList data={DATA}/>
    </SafeAreaView>
  )
}

export default Database

const styles = StyleSheet.create({

})