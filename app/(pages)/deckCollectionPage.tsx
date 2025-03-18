import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppStyle } from '@/style/AppStyle'
import DeckCollection from '@/components/collection/DeckCollection'
import TopBar from '@/components/TopBar'
import BackButton from '@/components/BackButton'
import { Colors } from '@/constants/Colors'


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

const styles = StyleSheet.create({})