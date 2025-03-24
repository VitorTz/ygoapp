import { 
    ActivityIndicator,
    StyleSheet, 
    TextInput, 
    Platform, 
    ScrollView, 
    Pressable, 
    KeyboardAvoidingView,
    Text, 
    View, 
    Alert
} from 'react-native'
import { GlobalContext } from '@/helpers/context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Colors } from '../../constants/Colors';
import { AppStyle } from '@/style/AppStyle';
import { useContext, useState } from 'react'
import { supabase } from '@/lib/supabase';
import Toast from '../Toast';
import * as yup from 'yup';
import React from 'react'
import DialogMessage from '../DialogMessage';


const schemaNameEmail = yup.object().shape({  
    name: yup
        .string()
        .min(3, 'Name must be at least 3 characters')        
        .max(30, 'Max 30 characters')
        .required('Name is required'),
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required')    
});

const schemaPassword = yup.object().shape({      
    password: yup
        .string()
        .min(3, 'Password must be at least 3 characters')
        .required('Password is required'),  
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Password must be the same')
        .required('Password is required')
});

interface NameEmailFormData {
    name: string
    email: string
}

interface PasswordFormData {
    password: string
    confirmPassword: string
}

const EditNameEmail = () => {
    const context = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<NameEmailFormData>({
        resolver: yupResolver(schemaNameEmail),
        defaultValues: {            
            name: context.user ? context.user.name : '',
            email: context.session?.user.email ? context.session.user.email : '',
        },
    });

    const onSubmit = async (formData: NameEmailFormData) => {
        setLoading(true)
        console.log(formData)
        const { data, error } = await supabase.auth.updateUser(
            { email: formData.email.trim() }
        )
        if (error) {
            Toast.show({title: "Error", message: error.message, type: "error"})
            setLoading(false)
            return
        }
        
        console.log(data)
        DialogMessage.show({message: "corfimation email send", type: "info"})        
        setLoading(false)
    }

    return (
        <View style={{width: '100%', gap: 10}} >
            {/* Name */}
            <Text style={styles.inputHeaderText}>Name</Text>
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}                    
                    autoComplete='name'
                    autoCapitalize='words'                    
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}/>
                )}
            />
            {errors.name && (<Text style={styles.error}>{errors.name.message}</Text>)}
            
            {/* Email */}
            <Text style={styles.inputHeaderText}>Email</Text>
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}                    
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}/>
                )}
            />
            {errors.email && (<Text style={styles.error}>{errors.email.message}</Text>)}
            <Pressable onPress={handleSubmit(onSubmit)} style={styles.formButton} >
                {loading ?
                    <ActivityIndicator size={32} color={Colors.white} /> :
                    <Text style={AppStyle.textButton}>Update</Text>
                }
            </Pressable>
        </View>
    )
}


const EditPasswordForm = () => {
    const context = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordFormData>({
        resolver: yupResolver(schemaPassword),
        defaultValues: {            
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (formData: PasswordFormData) => {
        setLoading(true)
        const email = context.session?.user.email
        if (!email) {
            Toast.show({title: "Error", message: "You are not logged!", type: "error"})
            setLoading(false)
            return
        }
        console.log(formData)
        const { data, error } = await supabase.auth.updateUser(
            { 
                email: context.session!.user.email,
                password: formData.password
            }
        )
        if (error) {
            Toast.show({title: "Error", message: error.message, type: "error"})
            setLoading(false)
            return
        }
        console.log(data)
        Toast.show({title: "Succcess", message: "", type: "success"})
        setLoading(false)
    }

    return (
        <View style={{width: '100%', gap: 10}} > 
            {/* Password */}
            <Text style={styles.inputHeaderText}>Password</Text>
            <Controller
                name="password"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}/>
                )}
            />
            {errors.password && (<Text style={styles.error}>{errors.password.message}</Text>)}
        
            {/* Confirm Password */}
            <Text style={styles.inputHeaderText}>Confirm password</Text>
            <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}/>
                )}
            />
            {errors.confirmPassword && (<Text style={styles.error}>{errors.confirmPassword.message}</Text>)}
            <Pressable onPress={handleSubmit(onSubmit)} style={styles.formButton} >
                {loading ?
                    <ActivityIndicator size={32} color={Colors.white} /> :
                    <Text style={AppStyle.textButton}>Change Password</Text>
                }
            </Pressable>
        </View> 
    )

}

const EditProfileForm = () => {    

    return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
        <ScrollView style={{width: '100%'}} >
            <View style={{gap: 30}} >
                <EditNameEmail/>
                <View style={{width: '100%', height: 2, backgroundColor: Colors.white}} />
                <EditPasswordForm/>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
    )
}

export default EditProfileForm

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        gap: 20
    },
    input: {
        backgroundColor: Colors.gray1,
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
        color: Colors.orange,
        alignSelf: "flex-start",
        fontSize: 14,
        fontFamily: "LeagueSpartan_200ExtraLight"
    },
    formButton: {
        width: '100%',
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderRadius: 4,
        backgroundColor: Colors.orange
    },
    formButtonText: {
        color: Colors.white,
        fontSize: 22,
        fontFamily: "LeagueSpartan_400Regular",
    }
})