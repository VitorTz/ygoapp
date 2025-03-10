import Toast from "react-native-toast-message";
import * as FileSystem from 'expo-file-system'
import { API_CARD_WIDTH, API_CARD_HEIGHT, API_CARD_CROPPED_HEIGHT, API_CARD_CROPPED_WIDTH } from "@/constants/AppConstants";
import { Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";


export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const {
    width: deviceWidth, 
    height: deviceHeight
} = Dimensions.get('window');


export function wp(percentage) {
    const width = deviceWidth;
    return (percentage * width) / 100;
}


export function hp(percentage) {
    const height = deviceHeight;
    return (percentage * height) / 100;
}


export const showToast = (title, message, toastType) => {    
    Toast.show({
        type: toastType,
        text1: title,
        text2: message,
        position: "bottom",
        bottomOffset: 40,
        keyboardOffset: 10,
        text1Style: {
            fontFamily: "LeagueSpartan_600SemiBold",
            fontSize: 16,
            color: Colors.background
        },
        text2Style: {
            fontFamily: "LeagueSpartan_400Regular",
            fontSize: 16,
            color: Colors.background
        },
        visibilityTime: 2000
    });
}

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export function getImageHeight(width) {
    return width * (API_CARD_HEIGHT / API_CARD_WIDTH)
}

export function getImageHeightCropped(width) {
    return width * (API_CARD_CROPPED_HEIGHT / API_CARD_CROPPED_WIDTH)
}


export function getItemGridDimensions(
    horizontalPadding,
    gap,
    columns,
    originalWidth,
    originalHeight
) {
    const cardWidth = (wp(100) - horizontalPadding - (columns * gap)) / columns
    const cardHeight = cardWidth * (originalHeight / originalWidth)
    return {width: cardWidth, height: cardHeight}
}

export const downloadImage = async (fileName, imageUrl) => {
    const imageFilePath = `${FileSystem.documentDirectory}${fileName}`
    try {        
        const {uri, status} = await FileSystem.downloadAsync(imageUrl, imageFilePath)
        return {path: uri, success: true, status}
    } catch (err) {
        console.log(err)        
        return {success: false, status: 500, path: ''}
    }
}

export function removeTrailingNewlines(str) {
    return str.replace(/\n+$/, '');
}


export function max(a, b) {
    return a >= b ? a : b
}


export function min(a, b) {
    return a <= b ? a : b
}
