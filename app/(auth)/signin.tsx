import { SafeAreaView, StyleSheet, View  } from 'react-native'
import React from 'react'
import { AppStyle } from '../../style/AppStyle'
import { router } from 'expo-router';
import Logo from '../../components/Logo'
import SignInForm from '../../components/form/SignInForm'
import SkipButton from '../../components/SkipButton'


const SignIn = () => {

  const onSign = () => {
    router.replace("/(tabs)/database")
  }

  const onSkip = () => {
    router.replace("/(tabs)/database") 
  }

  return (
    <SafeAreaView style={AppStyle.safeArea} >
      <View style={{flex: 1, padding: 20, alignItems: "center"}}>
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