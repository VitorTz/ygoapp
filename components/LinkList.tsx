import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { wp, hp } from '@/helpers/util'
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
    const txtBgStyle = side == "right" ? { left: -wp(2.6) } : { right: -wp(2.6) }
    const imageStyle = side == "right" ? { left: wp(45) } : { left : -wp(5) }
  
    return (        
        <Pressable onPress={onPress} style={[styles.container, {borderColor: color}]} >        
            <Image
                source={IMAGE_ICON.get(imageKey)} 
                style={[styles.image, imageStyle]}
                contentFit='scale-down'
            />
            <View              
                style={{
                    width: '50%', 
                    height: '100%', 
                    alignSelf: side == "right" ? "flex-start" : "flex-end", 
                    alignItems: "center", 
                    justifyContent: "center"}}>
                <View style={[styles.textBg, {backgroundColor: color}, txtBgStyle]} >
                    <Text style={[AppStyle.textRegular, {color: Colors.white, fontSize: 22}]} >{title}</Text>
                </View>
            </View>
        </Pressable>    
  )
}



const LinkList = ({data}: {data: ContainerData[]}) => {

  return (
    <ScrollView style={{width: wp(100), paddingTop: 30}} >
        <View style={{width: wp(90), left: wp(5), gap: 30, overflow: "visible", alignItems: "center", justifyContent: "center"}} >
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
        <View style={{width: '100%', height: 120}} />
    </ScrollView>
  )
}

export default LinkList

const styles = StyleSheet.create({    
    container: {        
        width: '100%',        
        height: hp(16),
        borderWidth: 1,
        backgroundColor: Colors.background,
        borderRadius: 20,
        borderCurve: "continuous"
    },
    image: {
        width: '50%',        
        height: '130%',         
        position: 'absolute',        
        top: -wp(6),
    },
    textBg: {
        width: '100%', 
        height: '40%', 
        right: -20, 
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    }
})