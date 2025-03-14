import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import { Ionicons } from '@expo/vector-icons'
import { wp, hp } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import { Image } from 'expo-image'
import { Deck } from '@/helpers/types'


interface ContainerItem {
  onPress: () => void
  color: string
  title: string
  imageKey: any
  side: "left" | "right"
  imageWidth?: number
  imageHeight?: number
}


const IMAGES = {
  img1: require("@/assets/bg/ultimate_spirit_dragon.png"),
  img2: require("@/assets/bg/the_winged_dragon_of_ra.png"),
  img3: require("@/assets/bg/yubel.png")
}


const ContainerItem = ({onPress, color, title, imageKey, side, imageWidth, imageHeight}: ContainerItem) => {  
  const txtBgStyle = side == "right" ? { left: -10 } : { right: -10 }
  const imageStyle = side == "right" ? { left: 80 } : { left : -150 }
  const imageSize = imageWidth && imageHeight ? {width: imageWidth, height: imageHeight} : {}

  return (
    <Pressable onPress={onPress} style={[styles.container, {borderColor: color}]}>
        <View 
          style={{
            width: '50%', 
            height: '100%', 
            alignSelf: side == "right" ? "flex-start" : "flex-end", 
            alignItems: "center", 
            justifyContent: "center"
          }}>
            <View style={[styles.textBg, {backgroundColor: color}, txtBgStyle]} >
              <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 22}]} >{title}</Text>
            </View>
        </View>
        <Image
          source={IMAGES[imageKey]} 
          style={[styles.image, imageStyle, imageSize]}
          contentFit='contain'
          />
    </Pressable>
  )
}


interface DeckComponentProps {
  type: "create" | "view" // create a new deck or view a existing user deck
  deck?: Deck
}

const DeckComponent = ({type, deck}: DeckComponentProps) => {
  return (    
    <View style={{width: hp(20), height: hp(20), borderRadius: hp(20), borderWidth: 2, borderColor: Colors.purple, alignItems: "center", justifyContent: "center", backgroundColor: Colors.background}} >
      <Ionicons name='add' size={hp(10)} color={Colors.purple}/>
    </View>
  )
}


const Collection = () => {
  return (
    <SafeAreaView style={AppStyle.safeArea}>
      <View style={{flex: 1, gap: 30, alignItems: "center", padding: 20}} >
        
        <View style={{width: '100%', flexDirection: 'row', marginBottom: 20, alignItems: "center", justifyContent: "space-between"}} >
          <Text style={[AppStyle.textRegular, {fontSize: 32}]}>Collection</Text>
          <Ionicons name='document-outline' size={40} color={Colors.orange} />
        </View>

        <View style={[styles.container, {borderColor: Colors.purple}]} >
          <View style={[styles.textBg, {backgroundColor: Colors.purple}]} >
              <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 22}]} >Decks</Text>
          </View>
          <View style={{flex: 1, padding: 10, alignItems: "center", justifyContent: "center"}} >
            <DeckComponent type='create' />
          </View>
          
        </View>

       
      </View>
    </SafeAreaView>
  )
}

export default Collection

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: hp(60),
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
    width: '80%', 
    height: hp(6),
    left: -10,
    top: 10,
    marginBottom: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  }
})