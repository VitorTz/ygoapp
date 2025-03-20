import DeckCollection from '@/components/collection/DeckCollection'
import { SafeAreaView, StyleSheet } from 'react-native'
import BackButton from '@/components/BackButton'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import TopBar from '@/components/TopBar'
import React from 'react'


const DeckCollectionPage = () => {
  return (
    <SafeAreaView style={AppStyle.safeArea} >
        <TopBar title='Deck Collection' marginBottom={20} >
            <BackButton color={Colors.deckColor} />
        </TopBar>
        <DeckCollection/>
    </SafeAreaView>
  )
}

export default DeckCollectionPage
