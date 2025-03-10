import { 
  SafeAreaView, 
  Pressable, 
  ScrollView,
  ActivityIndicator, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  KeyboardAvoidingView  
} from 'react-native'
import React from 'react'
import { useState } from 'react'
import { AppStyle } from '../../style/AppStyle'
import { Colors } from '../../constants/Colors'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, router } from 'expo-router';
import { supabase, supaGetSession } from '@/lib/supabase';
import { showToast, sleep } from '../../helpers/util'
import Logo from '../../components/Logo'
import { AppConstants } from '../../constants/AppConstants'
import SignInForm from '../../components/SignInForm'



const SignIn = () => {

  const onSign = async () => {
    router.replace("/(tabs)/database")
  }

  return (
    <SafeAreaView style={AppStyle.safeArea} >
      <View style={{flex: 1, padding: 20, alignItems: "center"}}>
        <View style={{width: '100%', marginTop: 20, marginBottom: 100, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}} >
          <Logo/>
          <Pressable onPress={() => router.replace("(tabs)/database")} hitSlop={AppConstants.hitSlopLarge}>
            <Text style={[AppStyle.textRegular, {color: Colors.orange, textDecorationLine: "underline"}]}>Skip</Text>
          </Pressable>
        </View>
        <SignInForm onSignIn={onSign} />
      </View>      
    </SafeAreaView>
  )
}

export default SignIn

const styles = StyleSheet.create({

})