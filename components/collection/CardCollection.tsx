import { View, Pressable, Text, StyleSheet } from "react-native"
import { router } from "expo-router"
import { useState, useCallback } from "react"
import { useFocusEffect } from "expo-router"
import { fetchUserCards } from "@/lib/supabase"
import { Ionicons } from "@expo/vector-icons"
import CardGrid from "../grid/CardGrid"
import { Colors } from "@/constants/Colors"
import { AppStyle } from "@/style/AppStyle"
import { hp } from "@/helpers/util"
import { AppConstants } from "@/constants/AppConstants"
import { Card } from "@/helpers/types"


const CardCollection = () => {

  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<Card[]>([])

  const showLoading = cards.length == 0 && loading

  const update = async () => {
    setLoading(true)
    console.log("update")
    await fetchUserCards().then(values => setCards([...values]))
    setLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
        update()
    }, [])
  )


  return (
    <View style={[styles.container, {borderColor: Colors.cardColor, height: hp(50)}]} >
      <View style={[styles.textBg, {flexDirection: 'row', backgroundColor: Colors.cardColor, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10}]} >
          <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 22}]} >Cards</Text>
          <Pressable onPress={() => router.navigate("/(pages)/cardDatabase")} hitSlop={AppConstants.hitSlopLarge} >
            <Ionicons name='add' color={Colors.white} size={32} />
          </Pressable>
      </View>
      
      <View style={{width: '100%', flex: 1, padding: 10}} >
        <CardGrid
          cards={cards}
          hasResults={true}
          loading={showLoading}
          numColumns={4}
          padding={10}
          gap={20}/>
      </View>      
    </View>
  )
}

export default CardCollection;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: hp(50),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,    
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
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
  }
})