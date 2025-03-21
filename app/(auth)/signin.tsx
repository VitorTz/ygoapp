import { SafeAreaView, StyleSheet, View  } from 'react-native'
import React, { useContext } from 'react'
import { AppStyle } from '../../style/AppStyle'
import { router } from 'expo-router';
import Logo from '../../components/Logo'
import SignInForm from '../../components/form/SignInForm'
import SkipButton from '../../components/SkipButton'
import { GlobalContext } from '@/helpers/context';
import { initUserCards } from '@/helpers/globals';
import { supabase, supabaseGetSession, supabaseGetUser } from '@/lib/supabase';


const SignIn = () => {

  const context = useContext(GlobalContext)

  const onSign = async () => {
    const session = await supabaseGetSession()
    context.session = session
    await supabaseGetUser().then(value => context.user = value)
    await initUserCards(session!.user.id, context.userCards)
    router.replace("/database")

  }

  const onSkip = () => {
    router.replace("/(tabs)/database") 
  }

  return (
    <SafeAreaView style={AppStyle.safeArea} >
      <View style={{flex: 1, alignItems: "center"}}>
        <View style={styles.container} >
          <Logo/>
          <SkipButton onPress={onSkip} />
        </View>
        <SignInForm onSignIn={onSign} />
      </View>      
    </SafeAreaView>
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
    width: '100%', 
    marginTop: 20, 
    marginBottom: 100, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between"
  }
})