import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppStyle } from '../style/AppStyle'
import { Colors } from '../constants/Colors'


const Logo = () => {
  return (
    <View style={{flexDirection: 'row'}} >
      <Text style={AppStyle.textHeader}>Ygo</Text>
      <Text style={[AppStyle.textHeader, {color: Colors.white}]}>App</Text>
    </View>
  )
}

export default Logo

const styles = StyleSheet.create({})