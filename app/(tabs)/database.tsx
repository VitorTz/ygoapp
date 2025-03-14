import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import { wp, hp } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import { Image } from 'expo-image'
import Logo from '@/components/Logo'
import { Ionicons } from '@expo/vector-icons'
import Animated, { FadeInLeft } from 'react-native-reanimated'
import { router } from 'expo-router'
import LinkList, { ContainerData } from '@/components/LinkList'
import { IMAGE_ICON } from '@/helpers/icon'


const DATA: ContainerData[] = [
  {
    onPress: () => router.navigate("/deckDatabase"),
    color: Colors.purple,
    title: "Decks",
    imageKey: "UltimateSpirit"
  },
  {
    onPress: () => router.navigate("/cardDatabase"),
    color: Colors.red,
    title: "Cards",
    imageKey: "WingedDradonRa"
  },
  {
    onPress: () => {},
    color: Colors.orange,
    title: "Packs",
    imageKey: "Yubel"
  }
]

const Database = () => {
  return (
    <SafeAreaView style={AppStyle.safeArea}>
      <View style={{flex: 1, gap: 30, alignItems: "center", padding: 20}} >
        <View style={{width: '100%', flexDirection: 'row', marginBottom: 20, alignItems: "center", justifyContent: "space-between"}} >
          <Text style={[AppStyle.textRegular, {fontSize: 32}]}>Database</Text>
          <Ionicons name='server-outline' size={40} color={Colors.orange} />
        </View>
              
        <LinkList data={DATA}/>
      </View>
    </SafeAreaView>
  )
}

export default Database

const styles = StyleSheet.create({
  topContainer: {

  },
  container: {
    width: '100%',
    height: 140,
    borderWidth: 1,
    backgroundColor: Colors.gray,    
    borderRadius: 4
  },
  image: {
    width: 400, 
    height: 180, 
    position: 'absolute', 
    top: -20
  },
  textBg: {
    width: '100%', 
    height: '40%', 
    right: -10, 
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  }
})