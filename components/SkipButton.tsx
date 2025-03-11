import { StyleSheet, Text, Pressable, View } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import { AppConstants } from '@/constants/AppConstants'
import { Colors } from '@/constants/Colors'
import React from 'react'


const SkipButton = ({onPress}: {onPress: () => void}) => {
  return (
    <Pressable onPress={onPress} hitSlop={AppConstants.hitSlopLarge}>
        <Text style={[AppStyle.textRegular, {color: Colors.orange, textDecorationLine: "underline"}]}>Skip</Text>
    </Pressable>
  )
}

export default SkipButton

const styles = StyleSheet.create({})