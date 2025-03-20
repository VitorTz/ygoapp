import { Pressable } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { AppConstants } from '@/constants/AppConstants'
import { Colors } from '@/constants/Colors'
import React from 'react'


const BackButton = ({color = Colors.orange}: {color?: string}) => {

  return (
    <Pressable onPress={() => router.back()} hitSlop={AppConstants.hitSlopLarge} >
        <Ionicons name='return-down-back-outline' size={40} color={color} />
    </Pressable>
  )
}

export default BackButton
