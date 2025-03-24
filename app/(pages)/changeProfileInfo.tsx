import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppStyle } from '@/style/AppStyle'
import TopBar from '@/components/TopBar'
import BackButton from '@/components/BackButton'
import { Colors } from '@/constants/Colors'
import EditProfileForm from '@/components/form/EditProfileForm'

const ChangeProfileInfo = () => {
  return (
    <SafeAreaView style={AppStyle.safeArea} >
        <TopBar title='Edit Profile'>
            <BackButton color={Colors.white} />
        </TopBar>
        <EditProfileForm/>
    </SafeAreaView>
  )
}

export default ChangeProfileInfo

const styles = StyleSheet.create({})