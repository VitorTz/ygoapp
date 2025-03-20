import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { Ionicons } from '@expo/vector-icons'
import { Card } from '@/helpers/types'
import Toast from './Toast'
import { supabaseAddUserCard, rmvCardFromUser } from '@/helpers/globals'
import { GlobalContext } from '@/helpers/context'


const AddCardToUserCollection = ({card}: {card: Card}) => {
    
    const context = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)        
    const card_id: number = parseInt(card.card_id as any)
    
    const init = () => {
        const num = context.userCards.get(card_id)?.num_copies
        setTotal(num ? num : 0)
    }

    useEffect(
        () => { init() },
        [card]
    )

    const add = async () => {        
        if (context.user == null) {
            Toast.show({title: "Error", message: "You are not logged!", type: "error"})
            return
        }
        setLoading(true)
        await supabaseAddUserCard(card.card_id)
            .then(success => {
                if (success) {
                    if (context.userCards.has(card_id) == false) {
                        context.userCards.set(card_id, {...card, num_copies: 1} )
                    } else {
                        context.userCards.get(card_id)!.num_copies += 1
                    }
                    const n = context.userCards.get(card_id)!.num_copies
                    setTotal(n)
                }})
        setLoading(false)
    }

    const rmv = async () => {
        if (context.user == null) {
            Toast.show({title: "Error", message: "You are not logged!", type: "error"})
            return
        }        
        if (total == 0) {
            Toast.show({title: "Warning", message: "You dont have this card in your collection", type: "info"})
            return
        }
        setLoading(true)
        await rmvCardFromUser(card)
            .then(success => {
                if (success) {
                    const n = context.userCards.get(card_id)!.num_copies
                    const newTotal = n >= 2 ? n - 1 : 0
                    context.userCards.get(card_id)!.num_copies = newTotal
                    setTotal(newTotal)
                    if (newTotal == 0) {
                        context.userCards.delete(card_id)                        
                    }
                }}
            )
        setLoading(false)
    }
  
        
    return (
        <View style={{width: '100%'}}>
            <Text style={[AppStyle.textHeader, {fontSize: 24, color: Colors.cardColor}]} >
                Copies in collection: {total}
            </Text>            
            <View style={styles.container} >
                {
                    loading ? 
                    <ActivityIndicator size={32} color={Colors.cardColor} /> :
                    <View style={{width: '100%', flexDirection: 'row', gap: 10}} >
                        <Pressable onPress={rmv} style={styles.button} >
                            <Ionicons name='remove-outline' size={32} color={Colors.white} />
                        </Pressable>
                        <Pressable onPress={add} style={styles.button} >
                            <Ionicons name='add-outline' size={32} color={Colors.white} />
                        </Pressable>
                    </View>
                }
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
        height: 50,
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