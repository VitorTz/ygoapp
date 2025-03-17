import { StyleSheet, ScrollView, Text, View } from 'react-native'
import { useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { fetchRandomTrivia } from '@/lib/supabase'
import { Colors } from '@/constants/Colors'
import { useCallback } from 'react'
import { AppStyle } from '@/style/AppStyle'
import React from 'react'


const RandomTrivia = () => {
  const [text, setText] = useState<string | null>('')
  
      const update = async () => {
          const data = await fetchRandomTrivia()
          setText(data)
      }
  
    useFocusEffect(
        useCallback(
            () => {
                update()
            },
            []
        )
    )
  
    return (
        <View style={{width: '100%', gap: 4}} >
            {
                text != '' &&
                <ScrollView style={{maxHeight: 100}} >
                    <Text style={[AppStyle.textRegular, {color: Colors.orange}]} >Did you know?</Text>
                    <Text style={AppStyle.textRegular} >{text}</Text>
                </ScrollView>            
            }
        </View>
    )
}

export default RandomTrivia

const styles = StyleSheet.create({})