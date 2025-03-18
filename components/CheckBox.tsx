import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

interface CheckBoxProps {
    active: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
    size: number
    color?: string
}

const CheckBox = ({active, setActive, size, color = Colors.accentColor}: CheckBoxProps) => {        
    console.log(active)
    
    return (
    <Pressable onPress={() => setActive(prev => !prev)} style={[styles.container, {width: size, height: size}]} >
        {
            active &&
            <Ionicons name='checkmark-outline' size={size - 4} color={color} />
        }
    </Pressable>
    )
}

export default CheckBox

const styles = StyleSheet.create({
    container: {        
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.gray,        
        backgroundColor: Colors.background
    }
})