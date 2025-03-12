import { StyleSheet, Text, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import React from 'react'
import { getItemGridDimensions } from '@/helpers/util'
import { API_CARD_HEIGHT, API_CARD_WIDTH } from '@/constants/AppConstants'
import { Card } from '@/helpers/types'


interface DefaultRenderItemProsp {
    card: Card
    columns: number
    index: number
    width: number
    height: number
}

const DefaultRenderItem = ({card, index, columns, width, height}: DefaultRenderItemProsp) => {    
    return (
        <View>
            <Image source={card.image_url} style={{width, height, marginTop: index >= columns ? 10: 0}} />
        </View>
    )
}


interface CardGridProps {
    cards: any[]
    numColumns: number
    onEndReached?: () => void
    hasResults?: boolean
    Footer?: any
    RenderItem?: any
}

const CardGrid = ({
    cards, 
    numColumns, 
    Footer, 
    RenderItem, 
    onEndReached,
    hasResults = true
}: CardGridProps) => {
    const Item = RenderItem ? RenderItem : DefaultRenderItem    
    
    const {width, height} = getItemGridDimensions(
        10, 
        10, 
        numColumns, 
        API_CARD_WIDTH, 
        API_CARD_HEIGHT
    )
    
    return (
        <View style={{width: '100%', flex: 1, paddingLeft: 5}} >
            <FlashList                
                data={cards}
                keyboardShouldPersistTaps={"handled"}                
                numColumns={numColumns}
                keyExtractor={(card, index) => index.toString()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={Footer ? () => <Footer hasResults={hasResults} /> : null}
                estimatedItemSize={height}
                renderItem={({item, index}) => <Item card={item} index={index} width={width} height={height} columns={numColumns} ></Item>}
            />
        </View>
    )
}

export default CardGrid

const styles = StyleSheet.create({})