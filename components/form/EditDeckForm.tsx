import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Pressable, 
    ActivityIndicator 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Deck } from '@/helpers/types';
import { AppStyle } from '@/style/AppStyle';
import { Colors } from '@/constants/Colors';
import { supabaseDeleteDeck } from '@/lib/supabase';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppConstants } from '@/constants/AppConstants';
import { hp } from '@/helpers/util';
import * as yup from 'yup';
import DialogMessage from '../DialogMessage';
import Toast from '../Toast';
import CheckBox from '../CheckBox';


const schema = yup.object().shape({  
    name: yup
        .string()
        .min(3, 'Name must be at least 3 characters')
        .max(64, 'Max 30 characters')
        .required('Email is required'),
    description: yup
        .string()
        .max(AppConstants.maxDeckDescrLenght, `Max ${AppConstants.maxDeckDescrLenght} characters`)
        .default(''),
    isPublic: yup
        .boolean()
        .default(false)
});

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
    const [isPublic, setIsPublic] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
        } = useForm<EditDeckFormData>({
        resolver: yupResolver(schema),
        defaultValues: {            
            name: deck.name,
            description: deck.descr ? deck.descr : '',
            isPublic: false
        },
    });
    
    const init = () => {        
        setIsPublic(deck.is_public as any == 'true' || deck.is_public == true)
    }

    useEffect(
        () => { init() },
        []
    )

    const onPress = async (formData: EditDeckFormData) => {
        formData.isPublic = isPublic
        setLoading(true)
        await onSubmit(formData)
        setLoading(false)
    } 

    const deleteDeck = async () => {        
        DialogMessage.show({                
                message: `Delete ${deck.name} deck?`,
                type: "info",
                okBtnTest: "Delete",
                onPress: async () => {
                    await supabaseDeleteDeck(deck.deck_id)
                        .then(success => {
                            success ? 
                                router.back() :    
                                Toast.show({title: "Error", message: "Could not delete deck", type: "error"})
                })}}
        )}

    return (
        <View style={{width: '100%', gap: 10}} >                        
            <Text style={AppStyle.textRegularLarge} >Name</Text>                    
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}                  
                    onChangeText={onChange}
                    value={value}/>
                )}
            />
            {errors.name && (<Text style={AppStyle.errorMsg}>{errors.name.message}</Text>)}
            <Text style={AppStyle.textRegularLarge} >Description</Text>
            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={[styles.input, {height: hp(18), textAlignVertical: "top"}]}
                    onBlur={onBlur}
                    multiline={true}
                    onChangeText={onChange}
                    value={value}/>
                )}
            />
            {errors.description && (<Text style={AppStyle.errorMsg}>{errors.description.message}</Text>)}

            <View style={{width: '100%', gap: 10, flexDirection: 'row', alignItems: "center", justifyContent: "flex-start"}} >
                <Text style={AppStyle.textRegular}>Is public?</Text>
                <CheckBox 
                    active={isPublic} 
                    setActive={setIsPublic} 
                    size={28}
                    color={Colors.deckColor}/>                
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
                        <Pressable onPress={handleSubmit(onPress)} style={[styles.button, {backgroundColor: Colors.deckColor}]} >
                            <Text style={AppStyle.textRegular}>Save</Text>
                        </Pressable>
                    </>
                }
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
        flex: 1, 
        gap: 10        
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