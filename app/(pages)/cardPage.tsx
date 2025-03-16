import { 
    SafeAreaView, 
    FlatList, 
    ScrollView, 
    StyleSheet, 
    Text, 
    View 
} from 'react-native'
import AddCardToUserCollection from '@/components/AddCardToUserCollection'
import CopyStringButton from '@/components/CopyStringButton'
import ShareImageButton from '@/components/ShareImageButton'
import { AppConstants } from '@/constants/AppConstants'
import { getImageHeight, wp } from '@/helpers/util'
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import React from 'react'
import BackButton from '@/components/BackButton'


const cardWidth = wp(80)
const cardHeight = getImageHeight(cardWidth)


const CardInfo = ({title, value}: {title: string, value: any}) => {
    return (
        <>
            {
                value &&                 
                <View style={{marginRight: 10}} >
                    <Text style={AppStyle.textHeader} >{title}</Text>
                    <Text style={AppStyle.textRegular} >{value}</Text>
                </View>                
            }
        </>
    )
}


const CardPage = () => {

    const card = useLocalSearchParams()
    const card_id = parseInt(card.card_id)
    
    const card_info = [
        {value: card.attack, title: 'Attack'},
        {value: card.defence, title: 'Defence'},
        {value: card.level, title: 'Level'},
        {value: card.attribute, title: 'Attribute'},
        {value: card.archetype, title: 'Archetype'},
        {value: card.frametype, title: 'Frametype'},
        {value: card.race, title: 'Race'},
        {value: card.type, title: 'Type'}
    ]
    

    return (
        <SafeAreaView style={[AppStyle.safeArea, {padding: 20}]} >
            <ScrollView>
                <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}} >
                    <View style={{flexDirection: 'row', gap: 20}} >                        
                        <ShareImageButton color={Colors.red} image_url={card.image_url} />
                        <CopyStringButton color={Colors.red} text={card.name} />
                    </View>
                    <BackButton color={Colors.cardColor} />
                </View>
                <Image source={card.image_url} style={{alignSelf: "center", width: cardWidth, height: cardHeight, marginVertical: 20}} contentFit='cover' />

                <View style={styles.container} >
                    <FlatList
                        data={card_info}
                        keyExtractor={(item) => item.title}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) => <CardInfo title={item.title} value={item.value} />}
                    />                        
                    <View>
                        <Text style={AppStyle.textRegular} >{card.descr}</Text>
                    </View>
                    <AddCardToUserCollection card_id={card_id} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CardPage

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        backgroundColor: Colors.gray, 
        borderRadius: 4, 
        flex: 1, 
        borderColor: Colors.red, 
        gap: 10,
        padding: 20,        
        borderWidth: 1
    }
})