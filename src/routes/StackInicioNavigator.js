import {createStackNavigator} from "@react-navigation/stack";
import React from "react";
import BottomTabNavigator from './BottomTabNavigator'
import CriarMeta from "../screens/CriarMeta";

export default function StackInicioNavigator() {
    const {Navigator, Screen} = createStackNavigator();


    return (
        <Navigator initialRouteName={''}>
            <Screen
                options={{headerShown: false}}
                name={'bottomTabNavigator'}
                component={BottomTabNavigator}
            />
            <Screen
                name={'Nova Meta'}
                component={CriarMeta}
            />
            <Screen
                name={'Nova atividade'}
                component={CriarMeta}
            />
        </Navigator>
    );
}
