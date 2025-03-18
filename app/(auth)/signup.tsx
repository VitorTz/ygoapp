import { SafeAreaView, StyleSheet, View  } from 'react-native'
import React from 'react'
import { AppStyle } from '../../style/AppStyle'
import { router } from 'expo-router';
import Logo from '../../components/Logo'
import SkipButton from '../../components/SkipButton'
import SignUpForm from '@/components/form/SignUpForm';


const SignUp = () => {

  const onSignUp = () => {
    router.replace("/(tabs)/database")
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
        <SignUpForm onSignUp={onSignUp} />
      </View>      
    </SafeAreaView>
  )
}

export default SignUp

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