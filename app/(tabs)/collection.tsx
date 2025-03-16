import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import { Ionicons } from '@expo/vector-icons'
import { wp, hp } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import CardCollection from '@/components/collection/CardCollection'
import DeckCollection from '@/components/collection/DeckCollection'

const Collection = () => {

  return (
    <SafeAreaView style={AppStyle.safeArea}>
      <View style={{flex: 1, gap: 30, alignItems: "center", padding: 20}} >
        
        <View style={{width: '100%', flexDirection: 'row', alignItems: "center"}} >
          <Text style={[AppStyle.textRegular, {fontSize: 32}]}>Collection</Text>          
        </View>
        <ScrollView style={{width: '100%', marginBottom: 60}} >
          <View style={{width: '100%', gap: 20}} >
            <DeckCollection/>
            <CardCollection/>
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  )
}

export default Collection

const styles = StyleSheet.create({
  
})