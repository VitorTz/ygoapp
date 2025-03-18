import { StyleSheet, Pressable, TextInput, Text, View, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { Card } from '@/helpers/types'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import React from 'react'
import { sleep } from '@/helpers/util'

interface CopyCardToDeckProps {
    card: Card
    numCardsOnDeck: number
    add: (card: Card) => void
    rmv: (card: Card) => void
}
  
  
const CopyCardToDeck = ({card, numCardsOnDeck, add, rmv}: CopyCardToDeckProps) => {

    const [loading, setLoading] = useState(false) 
    const [text, setText] = useState('')
    const [copiesOnDeck, setCopiesOnDeck] = useState(numCardsOnDeck)

    const handleAdd = async () => {
        setLoading(true)
        setCopiesOnDeck(prev => prev <= 2 ? prev + 1 : prev)
        await add(card)
        await sleep(200)
        setLoading(false)
    }

    const handleRmv = async () => {
        setLoading(true) 
        setCopiesOnDeck(prev => prev > 0 ? prev - 1 : prev)
        await rmv(card)
        await sleep(200)
        setLoading(false)
    }

    const addNum = async (num: number) => {
        if (num == numCardsOnDeck) {
            return
        }
        setLoading(true)
        while (numCardsOnDeck > 0) {
            await rmv(card)
            numCardsOnDeck -= 1
        }
        for (let i = 0; i < num; i++) {
            await add(card)
        }
        setCopiesOnDeck(num)
        await sleep(100)
        setLoading(false)
    }

    return (
        <View style={{width: '100%', gap: 10}} >
            <Text style={[AppStyle.textHeader, {color: Colors.red}]}>
                Copies on deck: {copiesOnDeck}
            </Text>
            <View style={styles.container} >
                <TextInput
                    style={styles.input}
                    placeholder='0'
                    value={text}
                    onChangeText={text => setText(text)}
                    maxLength={4}
                    keyboardType='numeric'
                    placeholderTextColor={Colors.white}/>
                <View style={styles.buttonsContainer} >
                    {
                        loading ?
                        <ActivityIndicator size={32} color={Colors.red} />
                        :
                        <>
                            <View style={{width: '100%', flexDirection: 'row', gap: 10}} >
                                <Pressable onPress={handleRmv} style={styles.button} >
                                    <Ionicons name='remove-outline' size={32} color={Colors.white} />
                                </Pressable>
                                <Pressable onPress={handleAdd} style={styles.button} >
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

export default CopyCardToDeck

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
        height: 50, 
        borderRadius: 4, 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: Colors.red
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
    },
    buttonsContainer: {
        flex: 1, 
        height: 50, 
        flexDirection: 'row', 
        alignItems: "center", 
        justifyContent: "center"
    }
})