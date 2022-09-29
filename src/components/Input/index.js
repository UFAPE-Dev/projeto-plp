import React from "react";
import {View, Text, TextInput, StyleSheet} from 'react-native'
import {widthPercentageToDP} from "../../util/normalizador";



export default function Input({title, placeholder = '', keyboardType = 'default', onChangeText, inputStyle, contentStyle = {}, defaultValue, multiline = false, numberOfLines = 1, editable, selectTextOnFocus, value}){

    const styles = StyleSheet.create({
        container: {
            width: "100%",
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
        },
        full: {
            width: "100%",
        },
        inputStyle: {
            width: "100%",
            paddingHorizontal: 8,
            borderRadius: 10,
            backgroundColor: "#EEE"
        }

    })

    return (
        <View style={styles.container}>
            <View style={{...styles.full, ...contentStyle }}>
                <Text style={{fontWeight: 'bold', fontSize: widthPercentageToDP('3%')}}>{title}</Text>
                <TextInput
                    value={value}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    defaultValue={defaultValue}
                    style={[{...styles.inputStyle, ...inputStyle}, !editable ? {color: 'black'}: {}]}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                    editable={editable}
                    selectTextOnFocus={selectTextOnFocus}
                />
            </View>
        </View>
    )
}


