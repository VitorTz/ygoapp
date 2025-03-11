import Animated, { 
  FadeInLeft, 
  FadeInRight, 
  FadeOutLeft, 
  FadeOutRight 
} from 'react-native-reanimated'
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Pressable
} from 'react-native'
import CardSearch from '@/components/CardSearch'
import { AppStyle } from '../../style/AppStyle'
import DeckSearch from '@/components/DeckSearch'
import { Colors } from '@/constants/Colors'
import { useState } from 'react'



const DeckOrCardFilter = ({
  filter, 
  setFilter
}: {
  filter: "Card" | "Deck", 
  setFilter: React.Dispatch<React.SetStateAction<"Card" | "Deck">>
}) => {
  return (
    <View style={{width: '100%', flexDirection: 'row', marginBottom: 10}} >
      <Pressable onPress={() => setFilter("Card")} style={{flex: 1, alignItems: "center", height: 40}} >
        <Text style={AppStyle.textHeader}>Card</Text>
        {
          filter == "Card" &&
          <Animated.View entering={FadeInLeft.duration(500)} style={{width: '100%', height: 2, position: 'absolute', bottom: 0, backgroundColor: Colors.orange}}/>
        }
        {
          filter == "Deck" &&
          <Animated.View entering={FadeOutLeft.duration(500)} style={{width: '100%', height: 2, position: 'absolute', bottom: 0, backgroundColor: Colors.orange}}/>
        }
      </Pressable>
      <Pressable onPress={() => setFilter("Deck")} style={{flex: 1, alignItems: "center", height: 40}} >
        <Text style={AppStyle.textHeader}>Deck</Text>
        {
          filter == "Deck" &&
          <Animated.View entering={FadeInRight.duration(500)} style={{width: '100%', height: 2, position: 'absolute', bottom: 0, backgroundColor: Colors.orange}}/>
        }
        {
          filter == "Card" &&
          <Animated.View entering={FadeOutRight.duration(500)} style={{width: '100%', height: 2, position: 'absolute', bottom: 0, backgroundColor: Colors.orange}}/>
        }
      </Pressable>
    </View>
  )
}


const Database = () => {

  const [filter, setFilter] = useState<"Card" | "Deck">("Card")

  return (
    <SafeAreaView style={[AppStyle.safeArea, {padding: 10, alignItems: "center", justifyContent: "center", paddingBottom: 80}]} >
      <DeckOrCardFilter filter={filter} setFilter={setFilter} />
      {filter == "Card" && <CardSearch/>}
      {filter == "Deck" && <DeckSearch/>}
    </SafeAreaView>
  )
}

export default Database

const styles = StyleSheet.create({})