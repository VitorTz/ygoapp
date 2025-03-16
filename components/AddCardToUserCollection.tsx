import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { supabase, supaAddCardToCollection, supaRmvCardFromCollection } from '@/lib/supabase'
import React, { useEffect, useState } from 'react'
import { showToast } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { Ionicons } from '@expo/vector-icons'


const AddCardToUserCollection = ({card_id}: {card_id: number}) => {

    const [total, setTotal] = useState(0)
    const [text, setText] = useState('')
    const [isLoading, setLoading] = useState(false)

    const updateTotal = async () => {
        const {data, error} = await supabase.from("user_cards").select("total").eq("card_id", card_id).single()
        setTotal(data ? data.total : 0)
    }

    useEffect(
        () => {            
            updateTotal()
        },
        []
    )

    const handleAddCardToCollection = async (num: number) => {        
        const success = await supaAddCardToCollection(card_id, num)        
        if (success) {            
            setTotal(prev => prev + num)
            return
        }
    }
    
    const handleRmvCardFromCollection = async (num: number) => {
        const success = await supaRmvCardFromCollection(card_id, num)
        if (success) {            
            setTotal(prev => prev - num >= 0 ? prev - num : 0)
        }       
    }

    const handlePress = async (type: "Add" | "Rmv") => {
        if (text == '0' || text == '') {
            showToast("Invalid Input!", '', 'info')
            return
        }
        const num: number = parseInt(text)
        setLoading(true)
        switch (type) {
            case "Add":
                await handleAddCardToCollection(num)
                break
            case "Rmv":
                await handleRmvCardFromCollection(num)
                break
            default:
                break
        }
        setLoading(false)
        setText('')
    }

    const height = 50
        
    return (
        <View style={{width: '100%'}}>
            <Text style={AppStyle.textHeader} >Collection</Text>
            <Text style={AppStyle.textRegular} >Total: {total}</Text>
            <View style={{width: '100%', marginTop: 10, flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 10}} >
                <TextInput
                    style={{flex: 0.3, color: Colors.white, fontFamily: "LeagueSpartan_400Regular", fontSize: 16, paddingLeft: 10, backgroundColor: Colors.background, borderRadius: 4, height: height}}
                    placeholder='0'
                    value={text}
                    onChangeText={text => setText(text)}
                    maxLength={4}
                    keyboardType='numeric'
                    placeholderTextColor={Colors.white}
                />
                <View style={{flex: 1, height, flexDirection: 'row', alignItems: "center", justifyContent: "center"}} >
                    {
                        isLoading ?                         
                        <ActivityIndicator size={32} color={Colors.orange} />
                        :
                        <>
                        <View style={{width: '100%', flexDirection: 'row', gap: 10}} >
                            <Pressable onPress={async () => handlePress("Rmv")} style={{flex: 1, alignItems: "center", justifyContent: "center", height: height, backgroundColor: Colors.orange, borderRadius: 4}} >
                                <Ionicons name='remove-outline' size={32} color={Colors.white} />
                            </Pressable>
                            <Pressable onPress={async () => handlePress("Add")} style={{flex: 1, alignItems: "center", justifyContent: "center", height: height, backgroundColor: Colors.orange, borderRadius: 4}} >
                                <Ionicons name='add-outline' size={32} color={Colors.white} />
                            </Pressable>
                        </View>
                        </>
                    }
                </View>
            </View>
        </View>
    )
}

export default AddCardToUserCollection

const styles = StyleSheet.create({})