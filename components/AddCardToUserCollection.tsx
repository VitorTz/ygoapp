import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { supabase, supaAddCardToCollection, supaRmvCardFromCollection, supaGetSession } from '@/lib/supabase'
import React, { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { Ionicons } from '@expo/vector-icons'
import Toast from './Toast'


const AddCardToUserCollection = ({card_id}: {card_id: number}) => {

    const [total, setTotal] = useState(0)    
    const userHasSession = useRef(false)

    const updateTotal = async () => {
        const {data, error} = await supabase.from(
            "user_cards"
        ).select("total").eq("card_id", card_id).single()
        setTotal(data ? data.total : 0)
    }

    const init = async () => {
        const session = await supaGetSession()
        userHasSession.current = session != null
        await updateTotal()
    }

    useEffect(
        () => {            
            init()
        },
        []
    )

    const add = async () => {
        if (userHasSession.current == false) {
            Toast.show({title: "Error", message: "You are not logged!", type: "error"})
            return
        }        
        const success = await supaAddCardToCollection(card_id, 1)
        if (!success) {
            Toast.show({title: "Error", message: "Could not add this card to collection", type: "error"})
            return            
        }
        setTotal(prev => prev + 1)
    }

    const rmv = async () => {        
        if (userHasSession.current == false) {
            Toast.show({title: "Error", message: "You are not logged!", type: "error"})
            return
        }        
        if (total == 0) {
            Toast.show({title: "Warning", message: "You dont have this card in your collection", type: "info"})
        }
        const success = await supaRmvCardFromCollection(card_id, 1)
        if (!success) {
            Toast.show({title: "Error", message: "Could not remove this card to collection", type: "error"})
            return            
        }
        setTotal(prev => prev > 0 ? prev - 1 : prev)
    }
  
        
    return (
        <View style={{width: '100%'}}>
            <Text style={[AppStyle.textHeader, {color: Colors.cardColor}]} >
                    Collection: {total}
            </Text>            
            <View style={styles.container} >
                <View style={{width: '100%', flexDirection: 'row', gap: 10}} >
                    <Pressable onPress={rmv} style={styles.button} >
                        <Ionicons name='remove-outline' size={32} color={Colors.white} />
                    </Pressable>
                    <Pressable onPress={add} style={styles.button} >
                        <Ionicons name='add-outline' size={32} color={Colors.white} />
                    </Pressable>
                </View>                
            </View>
        </View>
    )
}

export default AddCardToUserCollection

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        marginTop: 10, 
        flexDirection: 'row', 
        alignItems: "center", 
        justifyContent: "center", 
        gap: 10
    },
    button: {
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center", 
        height: 50, 
        backgroundColor: Colors.red, 
        borderRadius: 4
    },
    buttonContainer: {
        flex: 1, 
        height: 50, 
        flexDirection: 'row', 
        alignItems: "center", 
        justifyContent: "center"
    },
    input: {
        flex: 0.3, 
        color: Colors.white, 
        fontFamily: "LeagueSpartan_400Regular", 
        fontSize: 16, 
        paddingLeft: 10, 
        backgroundColor: Colors.background, 
        borderRadius: 4, 
        height: 50
    }
})