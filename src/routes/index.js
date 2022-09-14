import React from 'react'
import {NavigationContainer} from "@react-navigation/native";
import StackInicioNavigator from "./StackInicioNavigator";

export default function Routes() {
    return (
        <NavigationContainer>
            <StackInicioNavigator/>
        </NavigationContainer>
    )
}
