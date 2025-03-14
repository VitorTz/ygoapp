import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { IMAGE_ICON } from '@/helpers/icon'
import { Image } from 'expo-image'
import React from 'react'


interface ContainerItem {
    onPress: () => void
    color: string
    title: string
    imageKey: any
    side: "left" | "right"
    index: number
}


export interface ContainerData {
    onPress: () => void
    title: string
    color: string
    imageKey: string    
}


const ContainerItem = ({
    onPress, 
    color, 
    title, 
    imageKey, 
    side,
    index
}: ContainerItem) => {  
  const txtBgStyle = side == "right" ? { left: -10 } : { right: -10 }
  const imageStyle = side == "right" ? { left: 60 } : { left : -130 }
    const fade = side == "left" ? 
        FadeInLeft.delay((index + 1)* 50).duration(600) : 
        FadeInRight.delay((index + 1)* 50).duration(600)
  return (        
    <Pressable onPress={onPress} style={[styles.container, {borderColor: color}]} >
        <Animated.View entering={fade}>
            <View 
            style={{
                width: '50%', 
                height: '100%', 
                alignSelf: side == "right" ? "flex-start" : "flex-end", 
                alignItems: "center", 
                justifyContent: "center"
            }}>
                <View style={[styles.textBg, {backgroundColor: color}, txtBgStyle]} >
                <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 22}]} >{title}</Text>
                </View>
            </View>
            <Image
            source={IMAGE_ICON.get(imageKey)} 
            style={[styles.image, imageStyle]}
            contentFit='contain'
            />
        </Animated.View>
    </Pressable>
  )
}



const LinkList = ({data}: {data: ContainerData[]}) => {

  return (
    <View style={{width: '100%', gap: 30, alignItems: "center", justifyContent: "center"}} >
      {data.map(
        (item, index) => {
            return (
                <ContainerItem 
                    key={index.toString()} 
                    onPress={item.onPress} 
                    title={item.title}
                    color={item.color}
                    imageKey={item.imageKey}
                    side={(index + 1) % 2 != 0 ? "left" : "right"}
                    index={index}
                />
            )
        }
      )}
    </View>
  )
}

export default LinkList

const styles = StyleSheet.create({    
    container: {
        width: '100%',
        height: 140,
        borderWidth: 1,
        backgroundColor: Colors.gray,    
        borderRadius: 4
    },
    image: {
        width: 400, 
        height: 180, 
        position: 'absolute', 
        top: -20
    },
    textBg: {
        width: '100%', 
        height: '40%', 
        right: -10, 
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    }
})