import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import React from "react";
import Metas from "../screens/Metas";
import Tarefas from "../screens/Tarefas";
import Estatisticas from "../screens/Estatisticas";
import {View} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5'
import Lembretes from "../screens/Lembretes";

export default function BottomTabNavigator() {
    const {Navigator, Screen} = createBottomTabNavigator()

    return (
        <Navigator
            initialRouteName='Metas'
            backBehavior={'initialRoute'}
            screenOptions={{
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white',
                tabBarLabelStyle: {
                    fontWeight: 'bold'
                },
                tabBarStyle: {
                    backgroundColor: '#006EFF',
                },
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
                name={'Metas'}
                component={Metas}
                options={{
                    tabBarIcon: ({focused, color}) => {
                        return (
                            <View style={{alignItems: 'center'}}>
                                <Icon name={'bullseye'} size={20} color={color}/>
                            </View>
                        )
                    },
                }}
            />
            <Screen
                name={'Tarefas'}
                component={Tarefas}
                options={{
                    tabBarIcon: ({focused, color}) => {
                        return (
                            <View style={{alignItems: 'center'}}>
                                <Icon name={'tasks'} size={20} color={color}/>
                            </View>
                        )
                    },
                }}
            />
            <Screen
                name={'Lembretes'}
                component={Lembretes}
                options={{
                    tabBarIcon: ({focused, color}) => {
                        return (
                            <View style={{alignItems: 'center'}}>
                                <Icon name={'bell'} size={20} color={color}/>
                            </View>
                        )
                    },
                }}
            />
            <Screen
                name={"Estatísticas"}
                component={Estatisticas}
                options={{
                    tabBarIcon: ({focused, color}) => {
                        return (
                            <View style={{alignItems: 'center'}}>
                                <Icon name={'chart-line'} size={20} color={color}/>
                            </View>
                        )
                    },
                }}
            />
        </Navigator>
    )
}
