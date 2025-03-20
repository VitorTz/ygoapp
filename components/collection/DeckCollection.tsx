import { View, Pressable, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { AppStyle } from "@/style/AppStyle"
import { AppConstants } from "@/constants/AppConstants"
import { Deck } from "@/helpers/types"
import { hp } from "@/helpers/util"
import { Colors } from "@/constants/Colors"
import { useCallback, useState } from "react"
import DeckGrid from "../grid/DeckGrid"
import { fetchUserDecks } from "@/lib/supabase"
import { router, useFocusEffect } from "expo-router"

const DeckCollection = () => {

    const [loading, setLoading] = useState(false)
    const [decks, setDecks] = useState<Deck[]>([])
    const showLoading = decks.length == 0 && loading

    const update = async () => {
        setLoading(true)
        await fetchUserDecks()
          .then(values => setDecks([...values]))
        setLoading(false)
    }

    useFocusEffect(
        useCallback(() => {
            update()
        }, [])
    )

    const onDeckPress = (deck: Deck) => {
      router.navigate({pathname: "/editDeck", params: deck as any})
    }
  
  
    return (
      <View style={[styles.container, {borderColor: Colors.purple}]} >
        <View style={[styles.textBg, {flexDirection: 'row', backgroundColor: Colors.purple, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10}]} >
            <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 22}]} >Decks: {decks.length}</Text>
            <Pressable onPress={() => router.navigate("/(pages)/createDeck")} hitSlop={AppConstants.hitSlop} >
                <Ionicons name='add' color={Colors.white} size={32} />
            </Pressable>            
        </View>
        
        <View style={{width: '100%', flex: 1, padding: 10}} >
          <DeckGrid
            allowEdit={true}
            decks={decks}
            columns={2}
            hasResult={true}
            loading={showLoading}
            padding={20}
            gap={30}
            onDeckPress={onDeckPress}/>
        </View>      
      </View>
    )
  }

export default DeckCollection

const styles = StyleSheet.create({
  container: {
    flex: 1,
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