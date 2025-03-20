import { 
    StyleSheet, 
    Pressable, 
    Text, 
    View 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card } from '@/helpers/types'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { getCardCopiesOnUserCollection } from '@/helpers/globals'


interface CopyCardToDeckProps {
    card: Card    
    add: (card: Card) => void
    rmv: (card: Card) => void
}
  
  
const CopyCardToDeck = ({card, add, rmv}: CopyCardToDeckProps) => {

    const [loading, setLoading] = useState(false)    
    const [copiesOnDeck, setCopiesOnDeck] = useState(0)
    
    useEffect(
        () => {
            setCopiesOnDeck(getCardCopiesOnUserCollection(card.card_id))
        },
        [card]
    )

    const handleAdd = async () => {
        if (loading) { return }
        setLoading(true)        
        setCopiesOnDeck(prev => prev <= 2 ? prev + 1 : prev)
        await add(card)        
        setLoading(false)
    }

    const handleRmv = async () => {
        if (loading) { return }
        setLoading(true) 
        setCopiesOnDeck(prev => prev > 0 ? prev - 1 : prev)
        await rmv(card)        
        setLoading(false)
    }

    return (
        <View style={{width: '100%', gap: 10}} >
            <Text style={[AppStyle.textHeader, {color: Colors.red}]}>
                Copies on deck: {copiesOnDeck}
            </Text>
            <View style={styles.buttonsContainer} >
                <View style={{width: '100%', flexDirection: 'row', gap: 10}} >
                    <Pressable onPress={handleRmv} style={styles.button} >
                        <Ionicons name='remove-outline' size={32} color={Colors.white} />
                    </Pressable>
                    <Pressable onPress={handleAdd} style={styles.button} >
                        <Ionicons name='add-outline' size={32} color={Colors.white} />
                    </Pressable>
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