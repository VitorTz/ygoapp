import { ActivityIndicator, Linking, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { supabase, supabaseGetUser } from '../../lib/supabase'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { AppConstants } from '../../constants/AppConstants'
import { router } from 'expo-router'
import { AppStyle } from '../../style/AppStyle'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { Session } from '@supabase/supabase-js'
import { UserDB } from '@/helpers/types'
import RandomTrivia from '@/components/RandomTrivia'
import Toast from '@/components/Toast'
import { GlobalContext } from '@/helpers/context'


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
                <Ionicons name={iconName as any} size={32} color={Colors.white} />
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
        await supabaseGetUser().then(user => setUser(user))
    }

    useFocusEffect(
        useCallback(() => {
            update()
        }, [])
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


const Profile = () => {
    
    const context = useContext(GlobalContext)
    const [session, setSession] = useState<Session | null>(null)    

    const initPage = async () => {        
        setSession(context.session)        
    }

    useEffect(
        () => {
            initPage()
        },
        []
    )    

    const profile = async () => {
        router.navigate("/changeProfileInfo")
    }

    const settings = async () => {

    }

    const github = async () => {
        await Linking.openURL(AppConstants.githubUrl)
    }

    const logout = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) {
            Toast.show({title: "Error", message: error.message, type: "error"})            
        } else {
            setSession(null)
            context.user = null
            context.session = null
            context.userCards = new Map()
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
                        <View style={{alignItems: "center"}} >
                            <ProfileIcon/>
                        </View>
                        <View style={{gap: 16}} >
                            <Option title='Profile' subTitle='Name, email, password...' iconName='person-circle-outline' onPress={profile} />
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
        alignItems: "center",
        gap: 16,
        justifyContent: "center", 
        marginBottom: 60        
    },
    image: {
        width: 128, 
        height: 128, 
        borderRadius: 128        
    },
    brush: {
        backgroundColor: Colors.gray1, 
        borderRadius: 32, 
        position: 'absolute', 
        padding: 8, 
        right: 0,
        bottom: 0
    }
})