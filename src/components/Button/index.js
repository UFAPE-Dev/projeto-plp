import React from 'react'
import {StyleSheet, View, TouchableOpacity} from "react-native";

const styles = StyleSheet.create({
    shadow: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 500,
        padding: '2%',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 12,
    },
    icon: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default function Button({children, style = {}, onPress = null, color = 'white'}){
    return (
        <TouchableOpacity style={[styles.shadow, {backgroundColor: color}, style]} onPress={onPress}>
            {children}
        </TouchableOpacity>
    )
}