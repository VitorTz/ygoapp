import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppConstants } from '../../constants/AppConstants'
import { AppStyle } from '../../style/AppStyle'
import { Image } from 'expo-image'
import Animated, { FadeInDown, FadeInUp, FadeOutDown } from 'react-native-reanimated'
import { Colors } from '../../constants/Colors'
import { fetchProfileIcons, supaGetUser, supaUpdateUserIcon } from '../../lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ImageDB, UserDB } from '@/helpers/types'


var profileIcons: ImageDB[] = []


const ChangeProfileIcon = () => {
  
  const [user, setUser] = useState<UserDB | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [profileIcon, setProfileIcon] = useState<ImageDB | null>(null)
  const loading = user == null || profileIcon == null  

  const init = async () => {
    if (profileIcons.length == 0) {
      console.log("detch")
      profileIcons = await fetchProfileIcons()      
    }

    const usr = await supaGetUser()
    if (usr) {
      setUser(usr)
      setProfileIcon(usr.image)
    }    
  }

  useEffect(
    useCallback(() => {
      init()
    },
    []),
    []
  )

  const saveChanges = async () => {
    if (profileIcon!.image_id != null) {
      setIsSaving(true)
      await supaUpdateUserIcon(profileIcon!.image_id)
      setIsSaving(false)
    }
  }

  return (
    <SafeAreaView style={[AppStyle.safeArea]} >      
      <View style={{flex: 1, paddingVertical: 20, gap: 40, paddingHorizontal: 10, alignItems: "center", justifyContent: "center", backgroundColor: Colors.gray, margin: 20, marginVertical: 40, borderRadius: 4}} >
        {
          loading ?
          <ActivityIndicator size={64} color={Colors.orange} /> :
          <>

            <View style={{width: '100%', paddingHorizontal: 10, flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}} >
              {
                isSaving ?
                <ActivityIndicator size={32} color={Colors.orange} /> :
                <Pressable onPress={saveChanges} hitSlop={AppConstants.hitSlopLarge} >
                    <Ionicons name='checkmark-circle-outline' size={32} color={Colors.orange} />
                </Pressable>
              }
              <Pressable onPress={() => router.back()} hitSlop={AppConstants.hitSlopLarge} >
                <Ionicons name='chevron-back-circle-outline' size={32} color={Colors.orange} />
              </Pressable>
            </View>

            <Animated.View entering={FadeInUp.delay(10).duration(500)} >
              <Image 
                source={profileIcon.image_url} 
                style={styles.mainImage}
              />
            </Animated.View>

            <ScrollView style={{width: '100%'}} >
              <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap', alignItems: "center", justifyContent: "center"}} >
                {
                  profileIcons.map(
                    (item, index) => {
                      return (
                        <Animated.View key={index} entering={FadeInDown.delay(10 * index).duration(500)}  >
                          <Pressable onPress={() => setProfileIcon(item)} >
                            <Image source={item.image_url} style={styles.image} />
                          </Pressable>
                        </Animated.View>

                      )
                    }
                  )
                }
              </View>
            </ScrollView>
          </>
        }  
      </View>
    </SafeAreaView>
  )
}

export default ChangeProfileIcon

const styles = StyleSheet.create({
  mainImage: {
    width: 128,
    height: 128,
    borderRadius: 128
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 64
  }
})