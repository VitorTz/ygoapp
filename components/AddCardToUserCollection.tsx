import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { supabase, supaAddCardToCollection, supaRmvCardFromCollection, supaGetSession } from '@/lib/supabase'
import React, { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { Ionicons } from '@expo/vector-icons'
import { Card } from '@/helpers/types'
import Toast from './Toast'
import { addCardToUser, getCardCopiesOnUserCollection, rmvCardFromUser } from '@/helpers/globals'


const AddCardToUserCollection = ({card}: {card: Card}) => {

    const [total, setTotal] = useState(0)    
    const userHasSession = useRef(false)
    
    const init = async () => {
        await supaGetSession()
            .then(value => userHasSession.current = value != null)        
        setTotal(getCardCopiesOnUserCollection(card.card_id))
    }

    useEffect(
        () => { init() },
        [card]
    )

    const add = async () => {
        if (userHasSession.current == false) {
            Toast.show({title: "Error", message: "You are not logged!", type: "error"})
            return
        }
        await addCardToUser(card)
            .then(success => success ? setTotal(prev => prev + 1) : null)        
    }

    const rmv = async () => {        
        if (userHasSession.current == false) {
            Toast.show({title: "Error", message: "You are not logged!", type: "error"})
            return
        }        
        if (total == 0) {
            Toast.show({title: "Warning", message: "You dont have this card in your collection", type: "info"})
        }
        await rmvCardFromUser(card)
            .then(success => success ? setTotal(prev => prev > 0 ? prev - 1 : prev) : null)
    }
  
        
    return (
        <View style={{width: '100%'}}>
            <Text style={[AppStyle.textHeader, {fontSize: 24, color: Colors.cardColor}]} >
                Copies in collection: {total}
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