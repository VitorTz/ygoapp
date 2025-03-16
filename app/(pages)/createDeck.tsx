import { 
    StyleSheet, 
    Text, 
    TextInput,
    Pressable,
    SafeAreaView, 
    View,
    ScrollView 
} from 'react-native'
import { CreateDeckFormData } from '@/components/form/CreateDeckForm'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import CreateDeckForm from '@/components/form/CreateDeckForm'
import BackButton from '@/components/BackButton'
import { Ionicons } from '@expo/vector-icons'
import { AppConstants } from '@/constants/AppConstants'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import React, { useRef, useState } from 'react'
import { Card } from '@/helpers/types'



const CreateDeck = () => {
    
    const [cards, setCards] = useState<Card[]>([])
    const [filterIsOpened, setFilterOpened] = useState(false)
    const inputRef = useRef<TextInput>(null)

    const toggleFilter = () => {
        setFilterOpened(prev => !prev)
    }

    const handleSearch = async (input: string | null) => {
        console.log(input)
    }

    const debounceSearch = useCallback(
        debounce(handleSearch, 400),
        []
    )

    const create = async (formData: CreateDeckFormData) => {
        console.log(formData)
    }

    return (
        <SafeAreaView style={[AppStyle.safeArea]} >            
            <View style={{flex: 1, gap: 30, alignItems: "center", padding: 20}} >
                <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}} >
                    <Text style={[AppStyle.textRegular, {fontSize: 32}]}>Create Deck</Text>
                    <BackButton color={Colors.deckColor} />
                </View>
                <ScrollView style={{width: '100%', flex: 1}} >
                    <View style={{width: '100%', gap: 20}} >
                        <CreateDeckForm onSubmit={create} />
                        <View style={{flexDirection: 'row', width: '100%', gap: 10, alignItems: "center", justifyContent: "center"}} >
                            <TextInput
                            ref={inputRef}
                            style={styles.search}            
                            onChangeText={debounceSearch}
                            placeholder='search'
                            placeholderTextColor={Colors.white}/>
                            <Pressable 
                                onPress={toggleFilter} 
                                style={{position: 'absolute', right: 10}} 
                                hitSlop={AppConstants.hitSlopLarge}>
                                {
                                    filterIsOpened ?
                                    <Ionicons name='close-outline' size={32} color={Colors.cardColor} /> :
                                    <Ionicons name='options-outline' size={32} color={Colors.cardColor} />
                                }
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default CreateDeck

const styles = StyleSheet.create({
    search: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.gray,
        borderRadius: 10,
        fontFamily: "LeagueSpartan_400Regular",
        paddingLeft: 10,
        color: Colors.white,
        flex: 1,
        fontSize: 18
    },
    input: {
        backgroundColor: Colors.gray,
        borderRadius: 4,
        height: 50,
        fontSize: 18,
        paddingHorizontal: 10,
        color: Colors.white,
        fontFamily: "LeagueSpartan_400Regular",
        marginBottom: 10
    },
    inputHeaderText: {
        color: Colors.white,
        fontSize: 20,
        fontFamily: "LeagueSpartan_400Regular",
        marginBottom: 10
    },
    error: {
        color: Colors.deckColor,
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