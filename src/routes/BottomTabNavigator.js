import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import React from "react";
import Metas from "../screens/Metas";
import Tarefas from "../screens/Tarefas";
import Estatisticas from "../screens/Estatisticas";

export default function BottomTabNavigator() {
    const {Navigator, Screen} = createBottomTabNavigator()

    return (
        <Navigator
            initialRouteName='Metas'
            backBehavior={'initialRoute'}>
            <Screen
                name={'Metas'}
                component={Metas}
            />
            <Screen
                name={'Tarefas'}
                component={Tarefas}
            />
            <Screen
                name={"Estatísticas"}
                component={Estatisticas}
            />
        </Navigator>
    )
}
