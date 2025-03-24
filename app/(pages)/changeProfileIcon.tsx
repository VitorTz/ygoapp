import { 
  ActivityIndicator, 
  Pressable, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View 
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Animated, { FadeInDown, FadeInUp} from 'react-native-reanimated'
import { AppConstants } from '../../constants/AppConstants'
import { supabaseUpdateUserIcon } from '../../lib/supabase'
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

  useEffect(() => {
    init()
  }, [])

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
          <BackButton color={Colors.white} />
      </TopBar>
      <View style={{gap: 20, alignItems: "center", justifyContent: "center"}} >
        {
          loading ?
          <ActivityIndicator size={64} color={Colors.white} /> :
          <>
            <Animated.View entering={FadeInUp.delay(10).duration(500)} >
              <Image source={profileIcon.image_url} style={styles.mainImage}/>
            </Animated.View>

            <ScrollView style={{width: '100%', maxHeight: 420}} >
              <View style={styles.scrollViewContainer} >
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
            <Pressable onPress={saveChanges} style={styles.button} hitSlop={AppConstants.hitSlopLarge} >
                {
                  isSaving ?
                  <ActivityIndicator size={20} color={Colors.background} /> :
                  <Text style={[AppStyle.textRegularLarge, {color: Colors.background}]}>Save</Text>
                }            
            </Pressable>
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
  },
  button: {
    width: '100%',
    height: 50,
    alignItems: "center", 
    justifyContent: "center",     
    backgroundColor: Colors.white, 
    borderRadius: 4    
  },
  scrollViewContainer: {
    flexDirection: 'row', 
    rowGap: 4,
    columnGap: 8,
    flexWrap: 'wrap', 
    alignItems: "center", 
    justifyContent: "center"
  }
})