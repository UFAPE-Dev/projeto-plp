import {createStackNavigator} from "@react-navigation/stack";
import React from "react";
import BottomTabNavigator from './BottomTabNavigator'
import CriarMeta from "../screens/CriarMeta";
import CriarTarefa from "../screens/CriarTarefa";
import TarefasEstatisticas from "../screens/Estatisticas/TarefasEstatisticas";
import MetasEstatisticas from "../screens/Estatisticas/MetasEstatisticas";

export default function StackInicioNavigator() {
    const {Navigator, Screen} = createStackNavigator();


    return (
        <Navigator
            initialRouteName={''}
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#006EFF',
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                    fontWeight: 'bold',
                }
            }}
        >
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
                name={'Nova Tarefa'}
                component={CriarTarefa}
            />
            <Screen
                name={'Estatísticas de tarefas'}
                component={TarefasEstatisticas}
            />
            <Screen
                name={'Estatísticas de metas'}
                component={MetasEstatisticas}
            />
        </Navigator>
    );
}
