import { StyleSheet, Text, View, Pressable } from 'react-native'
import { AppConstants } from '@/constants/AppConstants'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard';
import { AppStyle } from '@/style/AppStyle';
import React, { useState } from 'react'
import { sleep } from '@/helpers/util';
import { Colors } from '@/constants/Colors';
import { showToast } from '@/helpers/util';


const CopyStringButton = ({text}: {text:string }) => {
    
    const [isCopyng, setCopyng] = useState(false)

    const handleShare = async () => {
        setCopyng(true)
        await Clipboard.setStringAsync(text)
        showToast("Content copied to clipboard", '', 'success')
        setCopyng(false)
    }

    return (        
        <Pressable onPress={handleShare} hitSlop={AppConstants.hitSlopLarge} >
            <Ionicons name='copy-outline' size={AppConstants.icon.size} color={AppConstants.icon.color} />
        </Pressable>                    
    )
}

export default CopyStringButton

const styles = StyleSheet.create({})