import React from "react";
import {View} from 'react-native'

export default function SectionLine({fill, style = null, borderWidth = 1}) {
    return (
        <View style={{...style,...{borderWidth: borderWidth, borderColor: fill, marginVertical: '1%'}}}/>
    )
}
