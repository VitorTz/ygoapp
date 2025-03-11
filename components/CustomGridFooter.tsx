import { ActivityIndicator, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import React from 'react'


const CustomFooter = ({hasResults}: {hasResults: boolean}) => {
    return (
        <View style={{width: '100%', alignItems: "center", marginTop: 10}} >
            {
                hasResults &&
                <ActivityIndicator size={32} color={Colors.orange} />
            }
        </View>
    )
}


export default CustomFooter