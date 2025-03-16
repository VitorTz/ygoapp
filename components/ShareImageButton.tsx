import { StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { AppConstants } from '@/constants/AppConstants'
import { Ionicons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import { AppStyle } from '@/style/AppStyle'
import * as Sharing from 'expo-sharing';
import { downloadImage } from '@/helpers/util'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'


const ShareImageButton = ({image_url, color = Colors.orange}: {image_url: string, color?: string}) => {

    const [isLoading, setIsLoading] = useState(false)    

    const handleShare = async () => {
        setIsLoading(true)
        const {success, status, path}  = await downloadImage("ygotempimage.jpg", image_url)
        setIsLoading(false)
        if (success) {
            await Sharing.shareAsync(path)
            await FileSystem.deleteAsync(path)
        }
    }

    return (
        <Pressable onPress={handleShare} hitSlop={AppConstants.hitSlopLarge} >
            {
                isLoading ?
                <ActivityIndicator size={AppConstants.icon.size} color={color} /> :
                <Ionicons name='share-social-outline' size={AppConstants.icon.size} color={color} />
            }
        </Pressable>
    )
}

export default ShareImageButton

const styles = StyleSheet.create({})