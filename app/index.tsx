import { ActivityIndicator, AppState, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '../constants/Colors'
import { supabase, supaGetSession } from '../lib/supabase';
import {
  useFonts,
  LeagueSpartan_100Thin,
  LeagueSpartan_200ExtraLight,
  LeagueSpartan_300Light,
  LeagueSpartan_400Regular,
  LeagueSpartan_500Medium,
  LeagueSpartan_600SemiBold,
  LeagueSpartan_700Bold,
  LeagueSpartan_800ExtraBold,
  LeagueSpartan_900Black,
} from '@expo-google-fonts/league-spartan';
import { router } from 'expo-router';
import { AppStyle } from '@/style/AppStyle';



AppState.addEventListener('change', (state) => {
  if (state === 'active') {
      supabase.auth.startAutoRefresh()
  } else {
      supabase.auth.stopAutoRefresh()
  }
})  


const index = () => {

  let [fontsLoaded] = useFonts({
    LeagueSpartan_100Thin,
    LeagueSpartan_200ExtraLight,
    LeagueSpartan_300Light,
    LeagueSpartan_400Regular,
    LeagueSpartan_500Medium,
    LeagueSpartan_600SemiBold,
    LeagueSpartan_700Bold,
    LeagueSpartan_800ExtraBold,
    LeagueSpartan_900Black,
  });

  const initPage = async () => {
    const session = await supaGetSession()
    if (session == null) {
      router.replace("/(auth)/signin")
    } else {
      router.replace("/database")
    }
  }

  useEffect(
    () => {
      if (fontsLoaded) {
        initPage()
      }
    },
    [fontsLoaded]
  )

  return (
    <SafeAreaView style={[AppStyle.safeArea, {alignItems: "center", justifyContent: "center"}]}>
      <ActivityIndicator size={64} color={Colors.orange}/>
    </SafeAreaView>    
  )
}

export default index

const styles = StyleSheet.create({})