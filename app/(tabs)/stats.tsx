import { StyleSheet, SafeAreaView, Text, View } from 'react-native'
import TopBar from '@/components/TopBar'
import { AppStyle } from '@/style/AppStyle'
import LinkList, { ContainerData } from '@/components/LinkList'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'


const DATA: ContainerData[] = [
  {
    onPress: () => router.navigate("/deckDatabase"),
    color: Colors.matchHistoryColors,
    title: "Match History",
    imageKey: "MatchHistory"
  }
]

const Stats = () => {
  return (
    <SafeAreaView style={AppStyle.safeArea}>
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}} >
        <TopBar title='Stats'/>
        <LinkList data={DATA}/>
      </View>
    </SafeAreaView>
  )
}

export default Stats

const styles = StyleSheet.create({})