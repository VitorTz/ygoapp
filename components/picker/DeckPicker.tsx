import { 
    ARCHETYPES, 
    ATTRIBUTES, 
    CARD_TYPES, 
    DECK_TYPES, 
    FRAMETYPES,     
    RACES    
} from '@/constants/AppConstants';
import MultipleDropDownPicker from './MultiplePicker';
import UniqueDropDownPicker from './UniquePicker';
import {View} from 'react-native';
import React from 'react';



interface CardCustomPickerProps {
    options: Map<string, string | string[] | null>
    applyFilter: () => void
}


const DeckPicker = ({options, applyFilter}: CardCustomPickerProps) => {
    return (
        <View style={{rowGap: 10, width: '100%'}} >
            <View style={{width: '100%', flexDirection: "row", gap: 10}} >
                <View style={{flex: 1}} >
                    <MultipleDropDownPicker options={options} optionKey='archetypes' applyPicker={applyFilter} title='Archetype' data={ARCHETYPES} zindex={7} searchable={true} />
                </View>

                <View style={{flex: 1}}>
                    <MultipleDropDownPicker options={options} optionKey='attributes' applyPicker={applyFilter} title='Attribute' data={ATTRIBUTES} zindex={6} />                
                </View>
            </View>

            <View style={{width: '100%', flexDirection: "row", gap: 10}} >
                <View style={{flex: 1}} >
                    <MultipleDropDownPicker options={options} optionKey='frametypes' applyPicker={applyFilter} title='Frametype' data={FRAMETYPES} zindex={5} />
                </View>

                <View style={{flex: 1}}>
                    <MultipleDropDownPicker options={options} optionKey='races' applyPicker={applyFilter} title='Race' data={RACES} zindex={4} searchable={true} />
                </View>
            </View>

            <View style={{width: '100%', flexDirection: "row", gap: 10}} >
                <View style={{flex: 1}} >
                    <MultipleDropDownPicker options={options} optionKey='types' applyPicker={applyFilter} title='Type' data={CARD_TYPES} zindex={3} searchable={true} />
                </View>

                <View style={{flex: 1}}>
                    <UniqueDropDownPicker defaultValue='Any' options={options} optionKey='deckType' applyPicker={applyFilter} title='Deck Type' data={DECK_TYPES} zindex={2}/>
                </View>
            </View>
        </View>
    )
}

export default DeckPicker