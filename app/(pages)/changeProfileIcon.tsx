import { 
  ActivityIndicator, 
  Pressable, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View 
} from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Animated, { FadeInDown, FadeInUp} from 'react-native-reanimated'
import { AppConstants } from '../../constants/AppConstants'
import { supabaseGetProfileIcons, supabaseUpdateUserIcon } from '../../lib/supabase'
import { ImageDB, UserDB } from '@/helpers/types'
import { GlobalContext } from '@/helpers/context'
import BackButton from '@/components/BackButton'
import { AppStyle } from '../../style/AppStyle'
import { Colors } from '../../constants/Colors'
import TopBar from '@/components/TopBar'
import { Image } from 'expo-image'


const ChangeProfileIcon = () => {
  
  const context = useContext(GlobalContext)
  const [user, setUser] = useState<UserDB | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [profileIcon, setProfileIcon] = useState<ImageDB | null | undefined>(null)
  const loading = user == null || profileIcon == null  

  const init = async () => {    
    setUser(context.user)
    setProfileIcon(context.user?.image)
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
      await supabaseUpdateUserIcon(profileIcon!.image_id)
      setIsSaving(false)
    }
  }

  return (
    <SafeAreaView style={AppStyle.safeArea} >
      <TopBar title='Profile Icon' >
        <BackButton/>
      </TopBar>
      <View style={{flex: 1, gap: 20, alignItems: "center", justifyContent: "center", backgroundColor: Colors.gray, padding: 20, borderRadius: 4}} >
        {
          loading ?
          <ActivityIndicator size={64} color={Colors.orange} /> :
          <>

            <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "flex-end"}} >
              <Pressable onPress={saveChanges} style={{width: 60, height: 40, alignItems: "center", justifyContent: "center", backgroundColor: Colors.accentColor, borderRadius: 4}} hitSlop={AppConstants.hitSlopLarge} >
                {
                  isSaving ?
                  <ActivityIndicator size={20} color={Colors.white} /> :
                  <Text style={AppStyle.textRegular}>save</Text>
                }            
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
                  context.profileIcons.map(
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
    borderRadius: 128,
    backgroundColor: Colors.background
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 64
  }
})