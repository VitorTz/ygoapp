import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import CardCollection from '@/components/collection/CardCollection'
import DeckCollection from '@/components/collection/DeckCollection'
import TopBar from '@/components/TopBar'


const Collection = () => {

  return (
    <SafeAreaView style={AppStyle.safeArea}>              
      <TopBar title='Collection'/>
      <ScrollView style={{width: '100%', marginBottom: 60}} >
        <View style={styles.container}>
            <DeckCollection/>
            <CardCollection/>            
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


export default Collection

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    gap: 20, 
    alignItems: "center", 
    justifyContent: "center"
  }
})