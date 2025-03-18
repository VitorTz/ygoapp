import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppStyle } from '@/style/AppStyle'
import CardCollection from '@/components/collection/CardCollection'
import TopBar from '@/components/TopBar'
import BackButton from '@/components/BackButton'
import { Colors } from '@/constants/Colors'


const CardCollectionPage = () => {
  return (
    <SafeAreaView style={AppStyle.safeArea} >
        <TopBar title='Card Collection' marginBottom={20} >
            <BackButton color={Colors.cardColor} />
        </TopBar>
        <CardCollection/>
    </SafeAreaView>
  )
}

export default CardCollectionPage

const styles = StyleSheet.create({})