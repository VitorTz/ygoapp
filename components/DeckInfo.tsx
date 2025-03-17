import { StyleSheet, FlatList, Text, View } from 'react-native'
import { AppStyle } from '@/style/AppStyle'
import { Colors } from '@/constants/Colors'
import React from 'react'

const DeckInfo = ({title, info}: {title: string, info: string | string[]}) => {        
    info && typeof info === "string" ? info = info.split(',') : info    
    return (
        <>
            {
                info &&
                <View style={{width: '100%', gap: 10}}>
                    <Text style={[AppStyle.textRegular, {color: Colors.orange, fontSize: 26}]}>{title}</Text>
                    <FlatList
                        data={info}
                        horizontal={true}
                        keyExtractor={item => item}
                        renderItem={({item}) => 
                            <View style={styles.container} >
                                <Text style={AppStyle.textRegular}>{item}</Text>
                            </View>
                        }

                    />                    
                </View>
            }
        </>
    )
}

export default DeckInfo

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16, 
        paddingVertical: 8, 
        borderRadius: 4, 
        marginRight: 10, 
        backgroundColor: Colors.gray
    }
})