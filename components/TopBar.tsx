import { View, Text, StyleSheet } from "react-native"
import { AppStyle } from "@/style/AppStyle"
import { Colors } from "@/constants/Colors"
import BackButton from "./BackButton"


const TopBar = ({
    title, 
    textColor = Colors.white, 
    buttonColor = Colors.orange,
    showBackButton = true
  }: {
    title: string, 
    textColor?:string, 
    buttonColor?: string
    showBackButton?: boolean
}) => {
    return (
      <View style={styles.container} >
        <Text style={[AppStyle.textRegular, {color: textColor, fontSize: 32}]}>{title}</Text>
        {showBackButton && <BackButton color={buttonColor} />}        
      </View>
    )
  }


export default TopBar


const styles = StyleSheet.create({
    container: {
        width: '100%', 
        flexDirection: 'row', 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: 20
    }   
})