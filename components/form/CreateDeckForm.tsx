import { StyleSheet, Pressable, TextInput, Switch, Text, View, ActivityIndicator } from 'react-native'
import { AppStyle } from '@/style/AppStyle';
import { AppConstants } from '@/constants/AppConstants';
import React, { useState } from 'react'
import { hp, sleep } from '@/helpers/util';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Colors } from '@/constants/Colors'


const schema = yup.object().shape({  
    name: yup
        .string()
        .min(3, 'Name must be at least 3 characters')
        .required('Email is required'),
    description: yup
        .string()
        .max(1000, 'Max 1000 characters')
        .default('')
});


export interface CreateDeckFormData {
    name: string
    description: string
}


const CreateDeckForm = ({onSubmit}: {onSubmit: (formData: CreateDeckFormData) => void}) => {

    const [loading, setLoading] = useState(false)
    const [isPublic, setIsPublic] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateDeckFormData>({
        resolver: yupResolver(schema),
        defaultValues: {            
            name: '',
            description: '',
        },
    });
    
    const toggleSwitch = () => {
        setIsPublic(prev => !prev)
    }    

    const onPress = async (formData: CreateDeckFormData) => {
        setLoading(true)        
        await onSubmit(formData)
        setLoading(false)
    }

    return (
        <View style={{width: '100%', gap: 10}} >
            <Text style={[AppStyle.textHeader, {color: Colors.white}]} >Deck name</Text>                    
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
                {errors.name && (<Text style={styles.error}>{errors.name.message}</Text>)}

                <Text style={[AppStyle.textHeader, {color: Colors.white}]} >Description</Text>                    
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
                {errors.description && (<Text style={styles.error}>{errors.description.message}</Text>)}
                <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "flex-start"}} >
                    <Text style={AppStyle.textRegular}>Is public?</Text>
                    <Switch 
                        value={isPublic} 
                        onChange={toggleSwitch} 
                        trackColor={{false: Colors.gray1, true: Colors.gray1}}
                        thumbColor={isPublic ? Colors.deckColor : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e" />
                </View>
                <Pressable onPress={handleSubmit(onPress)} style={{width: '100%', height: 50, backgroundColor: Colors.deckColor, borderRadius: 4, alignItems: "center", justifyContent: "center"}} >
                    {
                        loading ? 
                        <ActivityIndicator size={32} color={Colors.white} /> :
                        <Text style={[AppStyle.textRegular, {fontSize: 22}]}>Create</Text>
                    }
                </Pressable>
            </View>
    )
}

export default CreateDeckForm

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.gray,
        borderRadius: 4,
        height: 50,
        fontSize: 18,
        paddingHorizontal: 10,
        color: Colors.white,
        fontFamily: "LeagueSpartan_400Regular"
    },
    inputHeaderText: {
        color: Colors.white,
        fontSize: 20,
        fontFamily: "LeagueSpartan_400Regular"        
    },
    error: {
        color: Colors.deckColor,
        alignSelf: "flex-start",
        fontSize: 14,
        fontFamily: "LeagueSpartan_200ExtraLight"
    },
})