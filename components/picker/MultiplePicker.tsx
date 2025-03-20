import { StyleSheet, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { useState } from 'react'
import React from 'react'
import { wp } from '@/helpers/util'
import { Ionicons } from '@expo/vector-icons'


interface MultipleDropDownPickerProps {
    title: string,
    options: Map<string, any>,
    optionKey: string,
    applyPicker: () => void,
    data: string[],    
    zindex: number,
    allowEmptyValues?: boolean,   
    searchable?: boolean,    
    defaultValue?: string[],    
    listMode?: "FLATLIST" | "MODAL" | "SCROLLVIEW"
}


const MultipleDropDownPicker = ({
    title,
    options,
    optionKey,
    applyPicker,
    data,     
    zindex,
    allowEmptyValues = true,
    defaultValue = [],
    searchable = false,    
    listMode = "FLATLIST"
}: MultipleDropDownPickerProps) => {
    const [open, setOpen] = useState(false);        
    const [value, setValue] = useState<string[]>(defaultValue)
    const [items, setItems] = useState(data.map((v) => {return {label: v, value: v}}))

    const handlePress = async (v: any) => {
        if (v.lenght === 0 && !allowEmptyValues) { return }
        options.set(optionKey, v)
        await applyPicker()
    }        

    return (        
        <DropDownPicker
            zIndex={zindex}                
            open={open}
            style={{backgroundColor: Colors.gray, borderWidth: 0}}
            disabledStyle={{opacity: 0.5}}                             
            items={items}
            setOpen={setOpen}
            theme='DARK'
            listMode={listMode}
            modalContentContainerStyle={{backgroundColor: Colors.background, padding: wp(5)}}            
            modalAnimationType='slide'
            searchable={searchable}
            value={value}
            setValue={setValue}
            setItems={setItems}
            multiple={true}
            mode='BADGE'
            badgeProps={{activeOpacity: 0.5}}            
            placeholder={title}
            badgeTextStyle={{color: Colors.background}}
            badgeColors={Colors.white} 
            showBadgeDot={false}            
            searchPlaceholderTextColor={Colors.white}
            searchPlaceholder={`search ${title.toLocaleLowerCase()}...`}            
            CloseIconComponent={() => <Ionicons name='close-circle-outline' size={32} color={Colors.white} />}
            textStyle={AppStyle.textRegular}
            min={allowEmptyValues ? 0 : 1}            
            onChangeValue={(value: any) => handlePress(value)}
            dropDownContainerStyle={{backgroundColor: Colors.gray}}/>
    );
}

export default MultipleDropDownPicker

const styles = StyleSheet.create({})