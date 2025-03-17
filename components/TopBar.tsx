import { View, Text, StyleSheet } from "react-native"
import { AppStyle } from "@/style/AppStyle"
import { Colors } from "@/constants/Colors"
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated"
import BackButton from "./BackButton"


interface TopBarProps {
  title: string
  textColor?: string
  children?: React.JSX.Element
  marginBottom?: number
}


const TopBar = ({
    title, 
    textColor = Colors.white, 
    children,
    marginBottom = 20
  }: TopBarProps) => {
    return (
      <View style={[styles.container, {marginBottom}]} >
        <Animated.Text 
          entering={FadeInLeft.delay(50).duration(600)}
          style={[AppStyle.textRegular, {color: textColor, fontSize: 32}]}>{title}
        </Animated.Text>
        <Animated.View
          entering={FadeInRight.delay(50).duration(600)}>
          {children}
        </Animated.View>
      </View>
    )
  }


export default TopBar


const styles = StyleSheet.create({
    container: {
        width: '100%', 
        flexDirection: 'row', 
        alignItems: "center", 
        justifyContent: "space-between"
    }   
})