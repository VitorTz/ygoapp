import { 
    DEFAULT_HORIZONTAL_PADDING, 
    API_CARD_CROPPED_WIDTH, 
    API_CARD_CROPPED_HEIGHT 
} from '@/constants/AppConstants'
import { StyleSheet, View } from 'react-native'
import { MasonryFlashList } from '@shopify/flash-list'
import { Colors } from '@/constants/Colors'
import { Deck } from '@/helpers/types'
import { getItemGridDimensions } from '@/helpers/util'
import { wp } from '@/helpers/util'
import DeckGridItem from './DeckGridItem'
import React from 'react'
import CustomGridFooter from './CustomGridFooter'



interface DeckGridProps {
    decks: Deck[]
    onEndReached?: () => void
    columns: number    
    hasResult: boolean
    loading: boolean
    padding?: number
    gap?: number   
}

const DeckGrid = ({
  decks, 
  onEndReached, 
  columns, 
  hasResult, 
  loading, 
  padding = 10, 
  gap = 10
}: DeckGridProps) => {

  const {width, height} = getItemGridDimensions(
      padding,
      gap, 
      columns, 
      API_CARD_CROPPED_WIDTH, 
      API_CARD_CROPPED_HEIGHT
  )

  return (        
    <View style={styles.container}>
        <MasonryFlashList          
          data={decks}          
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps={"handled"}
          numColumns={columns}
          estimatedItemSize={80}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<CustomGridFooter color={Colors.deckColor} hasResults={hasResult} loading={loading}/>}
          renderItem={
              ({item, index}) => {
                return (
                  <DeckGridItem columns={columns} width={width} height={height} key={index} index={index} deck={item}/>
                )
            }
          }
        />        
    </View>
  )
}

export default DeckGrid

const styles = StyleSheet.create({
  container: {
    width: '100%', 
    flex: 1,    
  }  
})