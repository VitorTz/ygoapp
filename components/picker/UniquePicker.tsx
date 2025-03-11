import { StyleSheet } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyle'
import { useState } from 'react'
import React from 'react'


const UniqueDropDownPicker = ({
    title,
    options,
    optionKey,
    applyPicker,
    data,
    zindex,    
    defaultValue
}: {
    title: string,
    options: Map<string, string | string[] | null>,
    optionKey: string,
    applyPicker: () => void,
    data: string[],    
    zindex: number,    
    defaultValue: string    
}) => {
    const [open, setOpen] = useState(false);        
    const [value, setValue] = useState<string>(defaultValue)
    const [items, setItems] = useState(data.map((v) => {return {label: v, value: v}}))

    const handlePress = async (v: any) => {        
        options.set(optionKey, v)        
        await applyPicker()
    }        

    return (        
        <DropDownPicker
            zIndex={zindex}                
            open={open}
            style={{backgroundColor: Colors.gray, borderWidth: 1, borderRadius: 0, borderColor: Colors.orange}}
            disabledStyle={{opacity: 0.5}}                             
            items={items}
            setOpen={setOpen}
            theme='DARK'
            listMode="FLATLIST"            
            value={value}
            setValue={setValue}
            setItems={setItems}
            multiple={false}
            mode='BADGE'
            badgeProps={{activeOpacity: 0.5}}            
            placeholder={title}
            badgeTextStyle={{color: Colors.background}}
            badgeColors={Colors.white} 
            showBadgeDot={false}           
            textStyle={AppStyle.textRegular}
            min={1}
            onChangeValue={(value: any) => handlePress(value)}
            dropDownContainerStyle={{backgroundColor: Colors.gray}}
        />
    );
}

export default UniqueDropDownPicker

const styles = StyleSheet.create({})