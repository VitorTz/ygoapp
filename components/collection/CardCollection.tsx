import { View, Pressable, Text, StyleSheet } from "react-native"
import { router } from "expo-router"
import { useState, useCallback } from "react"
import { useFocusEffect } from "expo-router"
import { fetchUserCards } from "@/lib/supabase"
import { Ionicons } from "@expo/vector-icons"
import CardGrid from "../grid/CardGrid"
import { Colors } from "@/constants/Colors"
import { AppStyle } from "@/style/AppStyle"
import { deckToString, hp } from "@/helpers/util"
import { AppConstants } from "@/constants/AppConstants"
import { Card } from "@/helpers/types"


interface CardCollectionProps {
  height?: number | string | null
}


const CardCollection = ({height}: CardCollectionProps) => {

  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<Card[]>([])

  let num_cards = 0
  cards.forEach(item => item.num_copies ? num_cards += item.num_copies : null)
  const showLoading = cards.length == 0 && loading

  const update = async () => {
    setLoading(true)    
    await fetchUserCards().then(values => setCards([...values]))
    setLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
        update()
    }, [])
  )

  const sty = height != null ? {height} : {}

  return (
    <View style={styles.container} >
      <View style={[styles.textBg, {flexDirection: 'row', backgroundColor: Colors.cardColor, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10}]} >
          <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 22}]} >Cards: {num_cards}</Text>
          <Pressable onPress={() => router.navigate("/(pages)/cardDatabase")} hitSlop={AppConstants.hitSlopLarge} >
            <Ionicons name='add' color={Colors.white} size={32} />
          </Pressable>
      </View>
      
      <View style={[{width: '100%', flex: 1, padding: 10}, sty as any]}>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,    
    borderRadius: 4,
    borderColor: Colors.cardColor
  },  
  textBg: {
    width: '100%', 
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
  }
})