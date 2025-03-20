import { StyleSheet, ScrollView, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native'
import DeckInfo from '../DeckInfo';
import React, { useEffect, useState } from 'react'
import { Deck } from '@/helpers/types';
import { AppStyle } from '@/style/AppStyle';
import { Colors } from '@/constants/Colors';
import { wp, hp } from '@/helpers/util';
import { supaDeleteDeck } from '@/lib/supabase';
import { router } from 'expo-router';
import DialogMessage from '../DialogMessage';
import Toast from '../Toast';
import CheckBox from '../CheckBox';



export interface EditDeckFormData {
  name: string
  description: string
  isPublic: boolean  
}


interface EditDeckFormProps {
    deck: Deck    
    onSubmit: (formData: EditDeckFormData) => void
}

const EditDeckForm = ({deck, onSubmit}: EditDeckFormProps) => {    

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [descr, setDescr] = useState<string>('')
    const [isPublic, setIsPublic] = useState(false)
    
    const init = () => {
        setName(deck.name)
        setDescr(deck.descr as any)
        setIsPublic(deck.is_public as any == 'true' || deck.is_public == true)
    }

    useEffect(
        () => { init() },
        []
    )

    const saveDeck = async () => {
        setLoading(true)
        await onSubmit({name: name, description: descr as any, isPublic: isPublic})
        setLoading(false)
    }    

    const deleteDeck = async () => {
        DialogMessage.show(
            {                
                message: `Delete ${deck.name} deck?`,
                type: "info",
                okBtnTest: "Delete",
                onPress: async () => {
                    await supaDeleteDeck(deck.deck_id)
                        .then(success => {
                            success ? 
                                router.back() :    
                                Toast.show({title: "Error", message: "Could not delete deck", type: "error"})
                        })                    
                }
            }
        )
    }

    return (
        <View style={{width: '100%', gap: 10}} >            
            <View style={styles.container} >
                <Text style={[AppStyle.textRegular, {fontSize: 20}]}>Name</Text>
                <TextInput
                    value={name}
                    style={styles.input}
                    onChangeText={text => setName(text)}/>

                <Text style={[AppStyle.textRegular, {fontSize: 20}]}>Description</Text>
                <TextInput
                    value={descr}
                    style={[styles.input, {height: 180, textAlignVertical: "top"}]}
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={text => setDescr(text)}/>
                <View style={{width: '100%', gap: 10, flexDirection: 'row', alignItems: "center"}} >
                    <Text style={AppStyle.textRegular}>Is public?</Text>
                    <CheckBox color={Colors.deckColor} size={28} active={isPublic} setActive={setIsPublic}/>
                </View>
                <View style={{width: '100%', gap: 10, height: 50, alignItems: "center", justifyContent: "center", flexDirection: 'row'}} >
                    {
                        loading ? 
                        <ActivityIndicator size={32} color={Colors.deckColor} />
                        :
                        <>
                            <Pressable onPress={deleteDeck} style={styles.button} >
                                <Text style={AppStyle.textRegular}>Delete</Text>
                            </Pressable>
                            <Pressable onPress={saveDeck} style={[styles.button, {backgroundColor: Colors.deckColor}]} >
                                <Text style={AppStyle.textRegular}>Save</Text>
                            </Pressable>
                        </>
                    }
                </View>
            </View>
        </View>
    )
}

export default EditDeckForm

const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 10,
        width: '100%',
        color: Colors.white,
        height: 50,
        borderRadius: 4,
        backgroundColor: Colors.gray
    },
    container: {
        width: '100%',         
        borderRadius: 4, 
        borderWidth: 1,
        borderColor: Colors.deckColor,
        flex: 1, 
        gap: 10,
        padding: wp(4)        
    },
    button: {
        flex: 1, 
        height: 50,
        backgroundColor: Colors.red, 
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center"
    }
})