import { StyleSheet, Text, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import React from 'react'
import { getItemGridDimensions } from '@/helpers/util'
import { API_CARD_HEIGHT, API_CARD_WIDTH } from '@/constants/AppConstants'
import { Card } from '@/helpers/types'
import CardGridItem from './CardGridItem'
import CustomGridFooter from './CustomGridFooter'


interface CardGridProps {
    cards: any[]
    numColumns: number
    onEndReached?: () => void
    loading: boolean
    hasResults: boolean
    padding?: number
    gap?: number
    onCardPress?: (card: Card) => void
}


const CardGrid = ({
    cards, 
    numColumns,     
    onEndReached,
    loading,
    hasResults,
    padding = 10,
    gap = 10,
    onCardPress
}: CardGridProps) => {
    
    const {width, height} = getItemGridDimensions(
        padding,
        gap, 
        numColumns, 
        API_CARD_WIDTH, 
        API_CARD_HEIGHT
    )
    
    return (
        <View style={{width: '100%', flex: 1, paddingLeft: 5}} >
            <FlashList                
                data={cards}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps={"handled"}                
                numColumns={numColumns}
                keyExtractor={(card, index) => index.toString()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}                
                estimatedItemSize={height}
                ListFooterComponent={<CustomGridFooter loading={loading} hasResults={hasResults}/>}
                renderItem={
                    ({item, index}) => 
                        <CardGridItem 
                            onCardPress={onCardPress} 
                            card={item} 
                            index={index}
                            width={width} 
                            height={height} 
                            columns={numColumns}/>
                }
            />
        </View>
    )
}

export default CardGrid

const styles = StyleSheet.create({})