import { ActivityIndicator, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { supabase, supaGetSession, supaGetUser, fetchRandomTrivia } from '../../lib/supabase'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { AppConstants } from '../../constants/AppConstants'
import { router } from 'expo-router'
import { AppStyle } from '../../style/AppStyle'
import { Colors } from '../../constants/Colors'
import { showToast } from '../../helpers/util'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { Session } from '@supabase/supabase-js'
import { UserDB } from '@/helpers/types'


interface OptionProps {
    title: string
    subTitle: string
    iconName: string
    onPress: () => void
}

const Option = ({title, subTitle, iconName, onPress}: OptionProps) => {

    const [isLoading, setIsLoading] = useState(false)

    const handlePress = async () => {
        setIsLoading(true)
        await onPress()
        setIsLoading(false)
    }

    return (
        <Pressable onPress={handlePress} style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}} >
            <View style={{flexDirection: 'row', gap: 20, alignItems: "center", justifyContent: "center"}} >
                <Ionicons name={iconName} size={32} color={Colors.white} />
                <View style={{alignItems: "flex-start", justifyContent: "center"}} >
                    <Text style={[AppStyle.textHeader, {color: Colors.white, fontSize: 20}]}>{title}</Text>
                    <Text style={[AppStyle.textRegular, {fontSize: 14}]}>{subTitle}</Text>
                </View>
            </View>
            {
                isLoading ? 
                <ActivityIndicator size={32} color={Colors.white} /> :
                <Ionicons name='chevron-forward-outline' size={32} color={Colors.white} />
            }
        </Pressable>
    )
}


const ProfileIcon = () => {

    const [user, setUser] = useState<UserDB | null>(null)

    const update = async () => {
        await supaGetUser().then(user => setUser(user))
    }

    useFocusEffect(
        useCallback(
            () => {
                update()
            },
            []
        )
    )

    const changeIcon = () => {
        router.push("/(pages)/changeProfileIcon")
    }

    return (
        <>
            {
                user == null ? 
                <ActivityIndicator size={32} color={Colors.white} /> :
                <>
                <View>
                    <Image 
                        source={user.image.image_url} 
                        style={styles.image} 
                        contentFit='cover' 
                        placeholder={AppConstants.blurhash}                    
                    />
                    <Pressable style={styles.brush} onPress={changeIcon} hitSlop={AppConstants.hitSlopLarge} >
                        <Ionicons name='brush-outline' size={20} color={Colors.white} />
                    </Pressable>
                </View>
                <Text style={[AppStyle.textHeader, {color: Colors.white, fontSize: 22}]}>{user.name ? user.name : ''}</Text>
                </>
            }
        </>
    )
}


const RandomTrivia = () => {
        
    const [text, setText] = useState<string | null>('')

    const update = async () => {
        const data = await fetchRandomTrivia()
        setText(data)
    }

    useFocusEffect(
        useCallback(
            () => {
                update()
            },
            []
        )
    )

    return (
        <View style={{width: '100%', gap: 4}} >
            {
                text != '' &&
                <ScrollView style={{maxHeight: 100}} >
                    <Text style={[AppStyle.textRegular, {color: Colors.orange}]} >Did you know?</Text>
                    <Text style={AppStyle.textRegular} >{text}</Text>
                </ScrollView>            
            }
        </View>
    )
}

const Profile = () => {
    
    const [session, setSession] = useState<Session | null>(null)    

    const initPage = async () => {        
        const s = await supaGetSession()
        if (s == null) {
            router.replace("/(auth)/signin")
        } else {            
            setSession(s)
        }
    }

    useEffect(
        useCallback(
            () => {
                initPage()
            },
            []
        ),
        []
    )    

    const profile = async () => {

    }

    const settings = async () => {

    }

    const github = async () => {
        await Linking.openURL(AppConstants.githubUrl)
    }

    const logout = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) {
            showToast("Error", error.message, "error")
        } else {
            setSession(null)            
            router.replace("/(auth)/signin")
        }
    }


    return (
        <SafeAreaView style={AppStyle.safeArea} >            
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}} >
                {
                    session == null ?
                    <ActivityIndicator size={64} color={Colors.orange} /> :

                    <View style={styles.container} >
                        <View style={{alignItems: "center", marginBottom: 20}} >
                            <ProfileIcon/>
                        </View>
                        <View style={{gap: 20, marginBottom: 10}} >
                            <Option title='Profile' subTitle='Name, email, password...' iconName='person-circle-outline' onPress={() => console.log("profile")} />
                            <Option title='Settings' subTitle='color theme' iconName='settings-outline' onPress={() => console.log("settings")} />
                            <Option title='Github' subTitle='source code' iconName='logo-github' onPress={github} />
                            <Option title='Logout' subTitle='' iconName='log-out-outline' onPress={logout} />
                        </View>
                        <RandomTrivia/>
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        
        padding: 20, 
        borderRadius: 4, 
        backgroundColor: Colors.gray, 
        alignItems: "center", 
        justifyContent: "center", 
        marginHorizontal: 20
    },
    image: {
        width: 128, 
        height: 128, 
        borderRadius: 128, 
        backgroundColor: Colors.background
    },
    brush: {
        backgroundColor: Colors.background, 
        borderRadius: 32, 
        position: 'absolute', 
        padding: 8, 
        right: 0,
        bottom: 0
    }
})