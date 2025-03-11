import { 
    DEFAULT_HORIZONTAL_PADDING, 
    API_CARD_CROPPED_WIDTH, 
    API_CARD_CROPPED_HEIGHT 
} from '@/constants/AppConstants'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { MasonryFlashList } from '@shopify/flash-list'
import { Colors } from '@/constants/Colors'
import { Deck } from '@/helpers/types'
import { wp } from '@/helpers/util'
import DeckCard from './DeckCard'
import React from 'react'


const GRID_GAP = 10

interface DeckGridProps {
    decks: Deck[]
    onEndReached: () => void
    columns: number    
    hasResult: boolean
}

const DeckGrid = ({decks, onEndReached, columns, hasResult}: DeckGridProps) => {  

  const Footer = () => {
    return (
      <>
        {          
          hasResult && 
          <ActivityIndicator size={'large'} color={Colors.orange} />
        }
      </>
    )
  }

  const deckWidth = (wp(100) - DEFAULT_HORIZONTAL_PADDING - (columns * GRID_GAP)) / columns
  const deckHeight = deckWidth * (API_CARD_CROPPED_HEIGHT / API_CARD_CROPPED_WIDTH)

  return (        
    <View style={styles.container}>
        <MasonryFlashList          
          data={decks}          
          keyboardShouldPersistTaps={"handled"}
          numColumns={columns}
          estimatedItemSize={80}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<Footer/>}          
          renderItem={
              ({item, index}) => {
                return (
                  <DeckCard columns={columns} width={deckWidth} height={deckHeight} key={index} index={index} deck={item}/>
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