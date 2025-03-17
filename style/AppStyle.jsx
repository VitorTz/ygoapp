import { StyleSheet } from 'react-native'
import { wp } from '@/helpers/util'
import { Colors } from '../constants/Colors'

export const AppStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: wp(5)        
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
    },
    errorMsg: {
        color: Colors.red,
        fontFamily: "LeagueSpartan_300Light"
    }
})
