import { ActivityIndicator, AppState, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Colors } from '../constants/Colors'
import { supabaseGetProfileIcons, supabase, supabaseGetSession, supabaseGetUser } from '../lib/supabase';
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
import { initUserCards } from '@/helpers/globals';
import { GlobalContext } from '@/helpers/context';
import { resetGlobalContext } from '@/helpers/util';



const index = () => {
  const context = useContext(GlobalContext)
  
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

    resetGlobalContext(context)

    const session = await supabaseGetSession()

    context.session = session
    await supabaseGetProfileIcons().then(values => context.profileIcons = values)
    
    if (session) {
      await supabaseGetUser().then(value => context.user = value)
      await initUserCards(session.user.id, context.userCards)
      router.replace("/database")      
    } else {
      router.replace("/(auth)/signin")
    }

  }

  useEffect(
    () => {
      if (fontsLoaded) { initPage() }
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