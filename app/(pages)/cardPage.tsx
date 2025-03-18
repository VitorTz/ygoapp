import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet,     
    View 
} from 'react-native'
import AddCardToUserCollection from '@/components/AddCardToUserCollection'
import CopyStringButton from '@/components/CopyStringButton'
import ShareImageButton from '@/components/ShareImageButton'
import { getImageHeight, wp } from '@/helpers/util'
import { useLocalSearchParams } from 'expo-router'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import { Image } from 'expo-image'
import React from 'react'
import BackButton from '@/components/BackButton'
import CardInfoFlatList from '@/components/CardInfoFlatList'


const cardWidth = wp(80)
const cardHeight = getImageHeight(cardWidth)


const CardPage = () => {

    const card: any = useLocalSearchParams()
    const card_id: number = card.card_id as number

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
                    <CardInfoFlatList card={card} />
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
        borderRadius: 4, 
        flex: 1, 
        borderColor: Colors.red, 
        gap: 10,
        padding: 20,        
        borderWidth: 1
    }
})