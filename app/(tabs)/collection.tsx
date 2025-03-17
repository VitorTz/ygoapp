import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import { Ionicons } from '@expo/vector-icons'
import { wp, hp } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import CardCollection from '@/components/collection/CardCollection'
import DeckCollection from '@/components/collection/DeckCollection'
import TopBar from '@/components/TopBar'

const Collection = () => {

  return (
    <SafeAreaView style={AppStyle.safeArea}>              
      <TopBar title='Collection' marginBottom={20}/>
      <ScrollView style={{width: '100%', marginBottom: 60}} >
        <View style={{width: '100%', gap: 20}} >
          <DeckCollection/>
          <CardCollection/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Collection

const styles = StyleSheet.create({
  
})