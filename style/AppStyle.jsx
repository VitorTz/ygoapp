import { StyleSheet } from 'react-native'
import { Colors } from '../constants/Colors'

export const AppStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.orange
    },
    textRegular: {
        fontFamily: "LeagueSpartan_400Regular",
        color: Colors.white,
        fontSize: 16
    },
    textHeader: {
        fontFamily: "LeagueSpartan_600SemiBold",
        color: Colors.orange,
        fontSize: 26
    }
})