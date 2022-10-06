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

export default function Estatisticas() {
    const navigation = useNavigation().navigate;
    return (
        <>
            <Button color={'red'} onPress={() => navigation("Estatísticas de tarefas")} >
                <Text>Estatísticas de tarefas</Text>
            </Button>
            <Button color={'blue'} title="Estatísticas de metas" onPress={() => navigation("Estatísticas de metas")}>
                <Text>Estatísticas de metas</Text>
            </Button>

        </>

    )
}
