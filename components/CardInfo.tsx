import { StyleSheet, Text, View } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import React from 'react'
import { Colors } from '@/constants/Colors'


const CardInfo = ({title, value}: {title: string, value: any}) => {
    return (
        <>
            {
                value &&                 
                <View style={{marginRight: 10}} >
                    <Text style={[AppStyle.textHeader, {color: Colors.red}]} >{title}</Text>
                    <Text style={AppStyle.textRegular} >{value}</Text>
                </View>                
            }
        </>
    )
}

export default CardInfo

const styles = StyleSheet.create({})