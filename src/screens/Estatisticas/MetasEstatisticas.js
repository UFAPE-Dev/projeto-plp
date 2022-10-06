import React, {useState, useCallback} from 'react'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Grid, LineChart, XAxis, YAxis} from "react-native-svg-charts";
import {formatarPorcentagem} from "../../util/formatarPorcentagem";
import {useFocusEffect} from "@react-navigation/native";
import * as metas from "../../util/metas";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function MetasEstatisticas() {
    const [data, setData] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false)

    const [dadosMeta, setDadosMeta] = useState({
        ano: {
            concluidas: [],
            totais: []
        },
        mes: {
            concluidas: [],
            totais: []
        },
        semana: {
            concluidas: [],
            totais: []
        },
        categorias: [],
        tipos: []
    })

    async function onChange (event, selectedDate){
        if (!selectedDate) {
            setData(data)
        } else {
            setData(selectedDate)
            await initData()
        }
        setShowPicker(false)

    }

    async function initData() {
        let inicioAno = new Date(data.getFullYear(), 0, 1).toISOString()
        let fimAno = new Date(data.getFullYear(), 11, 31).toISOString()
        let metasConcluidasMeses = await metas.quantidadeMetasConcluidasMes(inicioAno, fimAno)

        //add missing months to the array metasConcluidasMeses
        for (let i = 0; i < 12; i++) {
            let encontrado = 0
            for (let j = 0; j < metasConcluidasMeses.length; j++) {
                if (metasConcluidasMeses[j]?.mes == i) {
                    encontrado = 1
                    break
                }
            }
            if (!encontrado) {
                metasConcluidasMeses.push({
                    mes: i,
                    quantidade: 0
                })
            }
        }

        metasConcluidasMeses.sort((a, b) => {
            return a.mes - b.mes
        })

        const dadosMetas = {
            ano: {
                concluidas: await metas.quantidadeMetasConcluidasAno(inicioAno, fimAno),
                totais: await metas.quantidadeMetasAno(inicioAno, fimAno),
            },
            mes: {
                concluidas: metasConcluidasMeses,
                totais: await metas.quantidadeMetasMes(inicioAno, fimAno),
            },
            semana: {
                concluidas: await metas.quantidadeMetasConcluidasSemanaMes(inicioAno, fimAno),
                totais: await metas.quantidadeMetasSemanaMes(inicioAno, fimAno),
            },
            tipos : await metas.quantidadeMetasConcluidasTipo(inicioAno, fimAno),
            categorias: await metas.quantidadeMetasConcluidasCategoria(inicioAno, fimAno)
        }

        setDadosMeta(dadosMetas)
    }

    useFocusEffect(useCallback(() => {
        let isActive = true;

        initData()

        return () => {
            isActive = false;
        };
    }, []))

    const axesSvg = {fontSize: 13, fill: 'grey'};
    const verticalContentInset = {top: 10, bottom: 10}
    const xAxisHeight = 20


    const mapMeses = {
        0: 'Jan',
        1: 'Fev',
        2: 'Mar',
        3: 'Abr',
        4: 'Mai',
        5: 'Jun',
        6: 'Jul',
        7: 'Ago',
        8: 'Set',
        9: 'Out',
        10: 'Nov',
        11: 'Dez'
    }

    const metasMeses = dadosMeta.mes.concluidas.map((mes) => mes.quantidade)
    const metasMesesTotais = dadosMeta.mes.totais.map((mes) => mes.quantidade)

    const metasMesesMaisProdutivos = dadosMeta.mes.concluidas.sort((a, b) => {
        return b.quantidade - a.quantidade
    }).slice(0, 4).map((mes) => mes.mes)

    const metasSemanasMaisProdutivas = dadosMeta.semana.concluidas.sort((a, b) => {
        return b.quantidade - a.quantidade
    }).slice(0, 4).map((mes) => mes.semana + "ª de " + mapMeses[Number.parseInt(mes.mes)] + ` - ${mes.quantidade} tarefas\n`)

    const styles = StyleSheet.create({
        titulo: {
            fontSize: 25,
            fontWeight: 'bold',
        },
        subTitulo: {
            fontSize: 15,
            fontWeight: 'bold',
        },
        spaceBetween:{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }

    })

    return(
        <View style={{padding: '3%'}}>
            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={data}
                    mode={'date'}
                    onChange={async (event, date) => await onChange(event, date)}
                />
            )}
            <ScrollView>
                <Text style={styles.titulo}>Metas</Text>
                <Text style={styles.subTitulo}>Total de metas</Text>
                <View style={{alignItems: 'flex-end'}}>
                    <TouchableOpacity style={{flexDirection: 'row', backgroundColor: 'blue', borderRadius: 30, padding: '1%', alignItems: 'center'}} onPress={() => setShowPicker(true)}>
                        <MaterialCommunityIcons name="calendar" size={24} color="white"/>
                        <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>{data.getFullYear()}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 200, padding: 20, flexDirection: 'row'}}>
                    <YAxis
                        key={'chart-1-y'}
                        data={metasMesesTotais}
                        style={{marginBottom: xAxisHeight}}
                        contentInset={verticalContentInset}
                        svg={axesSvg}
                    />
                    <View style={{flex: 1, marginLeft: 10}}>
                        <LineChart
                            key={'chart-1'}
                            style={{flex: 1}}
                            data={metasMesesTotais}
                            contentInset={verticalContentInset}
                            svg={{stroke: 'rgb(255,0,0)'}}
                        >
                            <Grid/>
                        </LineChart>
                        <XAxis
                            key={'chart-1-x'}
                            style={{marginHorizontal: -10, height: xAxisHeight}}
                            data={metasMesesTotais}
                            formatLabel={(value, index) => mapMeses[index]}
                            contentInset={{left: 10, right: 10}}
                            svg={axesSvg}
                        />
                    </View>
                </View>

                <Text style={styles.subTitulo}>Tarefas concluídas por mês</Text>

                <View style={{height: 200, padding: 20, flexDirection: 'row'}}>
                    <YAxis
                        key={'chart-2-y'}
                        data={metasMeses}
                        style={{marginBottom: xAxisHeight}}
                        contentInset={verticalContentInset}
                        svg={axesSvg}
                    />
                    <View style={{flex: 1, marginLeft: 10}}>
                        <LineChart
                            key={'chart-2'}
                            style={{flex: 1}}
                            data={metasMeses}
                            contentInset={verticalContentInset}
                            svg={{stroke: 'rgb(134, 65, 244)'}}
                        >
                            <Grid/>
                        </LineChart>
                        <XAxis
                            key={'chart-2-x'}
                            style={{marginHorizontal: -10, height: xAxisHeight}}
                            data={metasMeses}
                            formatLabel={(value, index) => mapMeses[index]}
                            contentInset={{left: 10, right: 10}}
                            svg={axesSvg}
                        />
                    </View>
                </View>
                <View style={[styles.spaceBetween, {marginBottom: '5%'}]}>
                    <Text style={{color: 'green'}}>Concluídas : {dadosMeta.ano.concluidas}</Text>
                    <Text style={{color: 'blue'}}>Totais : {dadosMeta.ano.totais}</Text>
                    <Text>Porcentagem: {formatarPorcentagem(dadosMeta.ano.concluidas / dadosMeta.ano.totais)}</Text>
                </View>
                <View style={[styles.spaceBetween]}>
                    <Text>4 Meses mais produtivos: </Text>
                    <Text style={{color: 'green'}}>{metasMesesMaisProdutivos.map(element => mapMeses[Number.parseInt(element)] + ", ")}</Text>
                </View>
                <View style={[styles.spaceBetween]}>
                    <Text>4 semanas mais produtivas: </Text>
                    <Text style={{color: 'green'}}>{metasSemanasMaisProdutivas}</Text>
                </View>

                <Text style={[styles.subTitulo, {marginTop: '1%'}]}>Metas concluídas por tipo(total):</Text>
                {
                    dadosMeta.tipos.map((item, index) => {
                        return (
                            <Text key={item.tipo + item.quantidade + index}>{item.tipo +  " - concluídas " + item.quantidade}</Text>
                        )
                    })
                }

                <Text style={styles.subTitulo}>Metas concluídas por categoria</Text>
                {
                    dadosMeta.categorias.map((item, index) => {
                        return (
                            <Text key={item.categoria + item.quantidade + index}>{item.categoria +  " - concluídas " + item.quantidade}</Text>
                        )
                    })
                }


            </ScrollView>
        </View>
    )
}