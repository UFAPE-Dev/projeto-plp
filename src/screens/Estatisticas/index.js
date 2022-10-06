import React, {useState, useEffect, useCallback} from 'react'
import {BarChart, Grid, LineChart, XAxis, YAxis} from 'react-native-svg-charts'
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native'
import * as scale from 'd3-scale'
import * as tarefas from "../../util/tarefas";
import * as metas from "../../util/metas";
import {MANHA, MEIAHORA, NOITE, TARDE, UMAHORA} from "../../model/enums/Bloco";
import {formatarPorcentagem} from "../../util/formatarPorcentagem";
import Swiper from "react-native-swiper";
import {useFocusEffect} from "@react-navigation/native";
import {allTarefas} from "../../services/TarefaService";
import Button from "../../components/Button";
import {useNavigation} from "@react-navigation/native";
import styles from './styles';
import Feather from "react-native-vector-icons/Feather";
import {widthPercentageToDP} from "../../util/normalizador";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ScreenContainer } from 'react-native-screens';

export default function Estatisticas() {
    const navigation = useNavigation().navigate;

    const stl = StyleSheet.create({
        container: {
            flex: 1,
            height: 70,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 25,
            marginTop: '2%',
            padding: '2%',

            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
        },
        addButton: {
            position: 'absolute',
            right: 0,
            bottom: 0,
            borderRadius: 100,
            padding: '2%',
            backgroundColor: '#006EFF',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            elevation: 15,
            marginRight: '1%',
            marginBottom: '1%'
        }
    })
    return (
        <>
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white'}}>
            <View style={{flex: 1}}>
                <Swiper style={stl.wrapper}>
                    <View style={{
                        padding: '3%',
                        margin: '2%',
                        backgroundColor: '#EFEFEF',
                        borderRadius: 30,
                        height: '50%',
                    }}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 17}}>Relatório</Text>
                        </View>

                        <View style={{padding: '0%', margin: '5%'}}>

                        <Button color={'#cd0c36'} onPress={() => navigation("Estatísticas de tarefas")} >
                            <Text style={{color: 'white'}}>Estatísticas de tarefas</Text>
                        </Button>
                        </View>

                        <View style={{padding: '0%', margin: '5%'}}>
                        <Button color={'blue'} title="Estatísticas de metas" onPress={() => navigation("Estatísticas de metas")}>
                            <Text style={{color: 'white'}}>Estatísticas de metas</Text>
                        </Button>
                        </View>

                    </View>
                </Swiper>
            </View>
        </View>
  
        </>

    )
}
