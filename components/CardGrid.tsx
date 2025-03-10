import { StyleSheet, Text, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import React from 'react'


interface DefaultRenderItemProsp {
    card: any
    index: number
    width: number
    height: number
}

const DefaultRenderItem = ({card, index, width, height}: DefaultRenderItemProsp) => {
    return (
        <View>
            <Image source={card.image_url} style={{width, height}} />
        </View>
    )
}


interface CardGridProps {
    cards: any[]
    numColumns: number
    Footer?: React.JSX.Element | null
    RenderItem?: React.JSX.Element | null
}

const CardGrid = ({
    cards, numColumns, Footer, RenderItem
}: CardGridProps) => {

    const Item = RenderItem ? RenderItem : DefaultRenderItem

    const width = 128
    const height = 200

    return (
        <View style={{width: '100%', flex: 1}} >
            <FlashList
                data={cards}
                keyboardShouldPersistTaps={"handled"}                
                numColumns={numColumns}
                keyExtractor={(card, index) => index}
                onEndReachedThreshold={0.5}
                ListFooterComponent={Footer}
                estimatedItemSize={200}
                renderItem={({item, index}) => <Item card={item} index={index} width={width} height={height} ></Item>}
            />
        </View>
    )
}

export default CardGrid

const styles = StyleSheet.create({})