import { StyleSheet, TextInput, Pressable, Text, Switch, ActivityIndicator, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppStyle } from '@/style/AppStyle';
import { Colors } from '@/constants/Colors';
import { wp, hp } from '@/helpers/util';
import * as yup from 'yup';
import { AppConstants } from '@/constants/AppConstants';
import { supaDeleteDeck } from '@/lib/supabase';
import { router } from 'expo-router';



const schema = yup.object().shape({  
    name: yup
        .string()
        .min(3, 'Name must be at least 3 characters')
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
    deck_id: number
    defaultName: string
    defaultDescr: string
    defaultIsPublic: boolean
    setName: React.Dispatch<React.SetStateAction<string>>
    setDescr: React.Dispatch<React.SetStateAction<string | null>>
    onSubmit: (formData: EditDeckFormData) => void
}

const EditDeckForm = ({
    deck_id,
    defaultName,
    defaultDescr,
    defaultIsPublic,
    setName,
    setDescr,
    onSubmit
}: EditDeckFormProps) => {

    const [loading, setLoading] = useState(false)
    const [isPublic, setIsPublic] = useState(true)    

    useEffect(
        () => {
            setIsPublic(defaultIsPublic)
        },
        []
    )

    const toggleSwitch = () => {
        setIsPublic(prev => !prev)
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EditDeckFormData>({
        resolver: yupResolver(schema),
        defaultValues: {            
            name: defaultName,
            description: defaultDescr,
            isPublic: defaultIsPublic
        },
    });

    const onPress = async (formData: EditDeckFormData) => {
        setLoading(true)
        formData.isPublic = isPublic
        await onSubmit(formData)
        setLoading(false)
    }

    const deleteDeck = async () => {
        setLoading(true)
        await supaDeleteDeck(deck_id)
        setLoading(false)
        router.back()
    }

    return (
        <View style={{width: '100%', gap: 10}} >
            <Text style={[AppStyle.textHeader, {color: Colors.white}]} >Name</Text>                    
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}                  
                    onChangeText={text => { setName(text); onChange(text)}}
                    value={value}/>
                )}
            />
            {errors.name && (<Text style={AppStyle.errorMsg}>{errors.name.message}</Text>)}
            <Text style={[AppStyle.textHeader, {color: Colors.white}]} >Description</Text>
            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={[styles.input, {height: hp(18), textAlignVertical: "top"}]}
                    onBlur={onBlur}
                    multiline={true}
                    onChangeText={text => {setDescr(text); onChange(text)}}
                    value={value}/>
                )}
            />
            {errors.description && (<Text style={AppStyle.errorMsg}>{errors.description.message}</Text>)}

            <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "flex-start"}} >
                <Text style={AppStyle.textRegular}>Is public?</Text>
                <Switch
                        
                    trackColor={{false: '#767577', true: Colors.gray1}}
                    thumbColor={isPublic ? Colors.deckColor : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isPublic}/>
            </View>

            <View style={{width: '100%', height: 50, alignItems: "center", justifyContent: "center"}} >
                {
                    loading ?
                    <ActivityIndicator size={32} color={Colors.deckColor} /> :
                    <View style={{width: '100%', flexDirection: 'row', height: 50, gap: 10}} >
                        <Pressable onPress={deleteDeck} style={{flex: 1, backgroundColor: Colors.red, borderRadius: 4, alignItems: "center", justifyContent: "center"}} >
                            <Text style={[AppStyle.textRegular, {fontSize: 20}]}>Delete</Text>
                        </Pressable>
                        <Pressable onPress={handleSubmit(onPress)} style={{flex: 1, backgroundColor: Colors.deckColor, borderRadius: 4, alignItems: "center", justifyContent: "center"}} >
                            <Text style={[AppStyle.textRegular, {fontSize: 20}]}>Save</Text>
                        </Pressable>
                    </View>
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
})