import React from "react";
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native'
import {widthPercentageToDP} from "../../util/normalizador";
import SectionLine from "../SectionLine";

export default function Card({onPress, children, title, section = false, button = false, contentStyle, cardStyle, titleColor, rightSideButton}){

    const conteudo = <>
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '2%'}}>
                {title ? <Text style={{color: titleColor ?? 'black', fontSize: widthPercentageToDP('4%'), marginTop: '1%'}}>{title}</Text> : null}
                {rightSideButton ?? <View/>}
            </View>
            {section ? <SectionLine fill={'white'}/> : null}
        </View>
        <View style={{...{flex:1, alignItems:'center', justifyContent:'center'}, ...contentStyle}}>
            {children}
        </View></>

    return (
        button ?
            <TouchableOpacity style={[styles.shadow, {...cardStyle, ...{backgroundColor: 'white', borderRadius: widthPercentageToDP('2%'), flex: 1}}]}
                                    onPress={onPress}>
                {conteudo}
            </TouchableOpacity>
        :
            <View style={[styles.shadow, {...cardStyle, ...{backgroundColor: 'white', borderRadius: widthPercentageToDP('2%'), flex: 1}}]}>
                {conteudo}
            </View>
    )
}

let styles = StyleSheet.create({
    shadow: {
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 12,
    }
})
