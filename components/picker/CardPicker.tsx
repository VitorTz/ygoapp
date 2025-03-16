import { StyleSheet, Text, View } from 'react-native'
import MultipleDropDownPicker from './MultiplePicker'
import React from 'react'
import { ARCHETYPES, ATTRIBUTES, CARD_TYPES, FRAMETYPES, RACES } from '@/constants/AppConstants'
import SortDropDownPicker from './SortPicker'


const CardPicker = ({
    options, 
    applyPicker,
    accentColor
}: {
    options: Map<string, any>, 
    applyPicker: () => void,
    accentColor: string
}) => {
  return (
    <View style={{width: '100%', rowGap: 10}} >
        <View style={{width: '100%', flexDirection: 'row', gap: 10}} >
            <View style={{flex: 1}} >
                <MultipleDropDownPicker 
                    data={ARCHETYPES} 
                    options={options} 
                    optionKey='archetype' 
                    title='Archetype' 
                    applyPicker={applyPicker}
                    searchable={true} 
                    allowEmptyValues={true} 
                    zindex={6}
                    accentColor={accentColor}/>
            </View>
            <View style={{flex: 1}} >
                <MultipleDropDownPicker 
                    data={ATTRIBUTES} 
                    options={options} 
                    optionKey='attribute' 
                    title='Attribute'
                    applyPicker={applyPicker}
                    searchable={false} 
                    allowEmptyValues={true} 
                    zindex={5}
                    accentColor={accentColor}/>
            </View>
        </View>

        <View style={{width: '100%', flexDirection: 'row', gap: 10}} >
            <View style={{flex: 1}} >
                <MultipleDropDownPicker 
                    data={FRAMETYPES} 
                    options={options} 
                    optionKey='frametype' 
                    title='Frametype' 
                    applyPicker={applyPicker}
                    searchable={true} 
                    allowEmptyValues={true} 
                    zindex={4}
                    accentColor={accentColor}/>
            </View>
            <View style={{flex: 1}} >
                <MultipleDropDownPicker 
                    data={RACES} 
                    options={options} 
                    optionKey='race' 
                    title='Race'
                    applyPicker={applyPicker}
                    searchable={true} 
                    allowEmptyValues={true} 
                    zindex={3}
                    accentColor={accentColor}/>
            </View>
        </View>

        <View style={{width: '100%', flexDirection: 'row', gap: 10}} >
            <View style={{flex: 1}} >
                <MultipleDropDownPicker 
                    data={CARD_TYPES} 
                    options={options} 
                    optionKey='type' 
                    title='Type' 
                    applyPicker={applyPicker}
                    searchable={true}
                    allowEmptyValues={true} 
                    zindex={2}
                    accentColor={accentColor}/>
            </View>
            <View style={{flex: 1}} >
                <SortDropDownPicker
                    title='Sort'
                    options={options}
                    applyPicker={applyPicker}
                    zindex={1}/>                
            </View>
        </View>
    </View>
  )
}

export default CardPicker

const styles = StyleSheet.create({})