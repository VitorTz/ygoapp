import { StyleSheet, TextInput, Pressable, Text, Switch, ActivityIndicator, View } from 'react-native'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppStyle } from '@/style/AppStyle';
import { Colors } from '@/constants/Colors';
import { AppConstants } from '@/constants/AppConstants';
import { wp, hp } from '@/helpers/util';
import * as yup from 'yup';
import CheckBox from '../CheckBox';



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


export interface CreateDeckFormData {
  name: string
  description: string
  isPublic: boolean  
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
            isPublic: false
        },
    });

    const onPress = async (formData: CreateDeckFormData) => {
        setLoading(true)
        formData.isPublic = isPublic
        await onSubmit(formData)
        setLoading(false)
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
                    onChangeText={onChange}
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

            <Pressable onPress={handleSubmit(onPress)} style={{width: '100%', justifyContent: "center", alignItems: "center", height: 50, borderRadius: 4, backgroundColor: Colors.deckColor}} >
            {
                loading ? 
                <ActivityIndicator size={32} color={Colors.white} /> :
                <Text style={[AppStyle.textRegular, {fontSize: 20}]}>Create</Text>
            }
            </Pressable>
        </View>
    )
}

export default CreateDeckForm

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