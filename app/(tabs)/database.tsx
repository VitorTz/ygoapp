import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { AppStyle } from '../../style/AppStyle'
import React, { useEffect, useState } from 'react'
import { supaFetchCards } from '../../lib/supabase'
import { Card } from '@/helpers/types'
import CardGrid from '../../components/CardGrid'


const Database = () => {

  const [cards, setCards] = useState<Card[]>([])

  const init = async () => {
    const newCards = await supaFetchCards(null, new Map(), 0)    
    setCards([...newCards])
  }

  useEffect(
    () => {
      init()
    },
    []
  )

  return (
    <SafeAreaView style={AppStyle.safeArea} >
      <CardGrid cards={cards} numColumns={3} />
    </SafeAreaView>
  )
}

export default Database

const styles = StyleSheet.create({})