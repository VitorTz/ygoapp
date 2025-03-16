import { View, Text, StatusBar } from 'react-native'
import Toast from 'react-native-toast-message'
import { Colors } from '../constants/Colors'
import { Stack } from 'expo-router'
import React from 'react'


const _layout = () => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.background}} >
        <StatusBar barStyle={'light-content'} backgroundColor={Colors.background} />
        <Stack>
            <Stack.Screen name='index' options={{headerShown: false}} />
            <Stack.Screen name='(auth)/signin' options={{headerShown: false}} />
            <Stack.Screen name='(auth)/signup' options={{headerShown: false}} />
            <Stack.Screen name='(pages)/changeProfileIcon' options={{headerShown: false}} />
            <Stack.Screen name='(pages)/cardPage' options={{headerShown: false}} />
            <Stack.Screen name='(pages)/deckPage' options={{headerShown: false}} />
            <Stack.Screen name='(pages)/deckDatabase' options={{headerShown: false}} />
            <Stack.Screen name='(pages)/cardDatabase' options={{headerShown: false}} />
            <Stack.Screen name='(pages)/createDeck' options={{headerShown: false}} />
            <Stack.Screen name='(tabs)' options={{headerShown: false}} />
        </Stack>
        <Toast/>
    </View>
  )
}

export default _layout