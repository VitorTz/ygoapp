import DialogMessage from '../components/DialogMessage'
import { View, Text, StatusBar } from 'react-native'
import { GlobalContext } from '@/helpers/context'
import { Colors } from '../constants/Colors'
import Toast from '@/components/Toast'
import { Card } from '@/helpers/types'
import { Stack } from 'expo-router'
import React from 'react'


const _layout = () => {
  return (
    <GlobalContext.Provider value={{
        user: null,  
        session: null,
        profileIcons: [],
        relatedCards: new Map<string, Card[]>(),
        userCards: new Map<number, Card>(),
        limitedCards: null
      }} >
      <View style={{flex: 1, backgroundColor: Colors.background}} >
          <StatusBar barStyle={'light-content'} backgroundColor={Colors.background} />
          <Stack>
              <Stack.Screen name='index' options={{headerShown: false}} />
              <Stack.Screen name='(auth)/signin' options={{headerShown: false}} />
              <Stack.Screen name='(auth)/signup' options={{headerShown: false}} />
              <Stack.Screen name='(pages)/changeProfileIcon' options={{headerShown: false}} />
              <Stack.Screen name='(pages)/changeProfileInfo' options={{headerShown: false}} />
              <Stack.Screen name='(pages)/cardPage' options={{headerShown: false}} />
              <Stack.Screen name='(pages)/deckPage' options={{headerShown: false}} />
              <Stack.Screen name='(pages)/deckDatabase' options={{headerShown: false}} />
              <Stack.Screen name='(pages)/cardDatabase' options={{headerShown: false}} />
              <Stack.Screen name='(pages)/createDeck' options={{headerShown: false}} />              
              <Stack.Screen name='(pages)/editDeck' options={{headerShown: false}} />
              <Stack.Screen name='(pages)/deckCollectionPage' options={{headerShown: false}} />
              <Stack.Screen name='(pages)/cardCollectionPage' options={{headerShown: false}} />
              <Stack.Screen name='(pages)/limitedCards' options={{headerShown: false}} />
              <Stack.Screen name='(tabs)' options={{headerShown: false}} />
          </Stack>
          <Toast.Component/>
          <DialogMessage.Component/>
      </View>
    </GlobalContext.Provider>
  )
}

export default _layout