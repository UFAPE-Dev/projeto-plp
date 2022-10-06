import React, {useState, useCallback} from 'react'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Grid, LineChart, XAxis, YAxis} from "react-native-svg-charts";
import {formatarPorcentagem} from "../../util/formatarPorcentagem";
import {MANHA, MEIAHORA, NOITE, TARDE, UMAHORA} from "../../model/enums/Bloco";
import {useFocusEffect} from "@react-navigation/native";
import * as tarefas from "../../util/tarefas";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function TarefasEstatisticas() {
    const [data, setData] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false)

    const [dados, setDados] = useState({
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
        horarios: {
            hora: 0,
            minutos: 0,
            manha: 0,
            tarde: 0,
            noite: 0,

        },
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
        let tarefasConcluidasMeses = await tarefas.quantidadeTarefasConcluidasMes(inicioAno, fimAno)

        //add missing months to the array tarefasConcluidasMeses
        for (let i = 0; i < 12; i++) {
            let encontrado = 0
            for (let j = 0; j < tarefasConcluidasMeses.length; j++) {
                if (tarefasConcluidasMeses[j]?.mes == i) {
                    encontrado = 1
                    break
                }
            }
            if (!encontrado) {
                tarefasConcluidasMeses.push({
                    mes: i,
                    quantidade: 0
                })
            }
        }

        tarefasConcluidasMeses.sort((a, b) => {
            return a.mes - b.mes
        })

        const dadosTarefas = {
            ano: {
                concluidas: await tarefas.quantidadeTarefasConcluidasAno(inicioAno, fimAno),
                totais: await tarefas.quantidadeTarefasAno(inicioAno, fimAno),
            },
            mes: {
                concluidas: tarefasConcluidasMeses,
                totais: await tarefas.quantidadeTarefasMes(inicioAno, fimAno),
            },
            semana: {
                concluidas: await tarefas.quantidadeTarefasConcluidasSemanaMes(inicioAno, fimAno),
                totais: await tarefas.quantidadeTarefasSemanaMes(inicioAno, fimAno),
            },
            horarios: {
                hora: await tarefas.quantidadeTarefasConcluidasBlocos(inicioAno, fimAno, UMAHORA),
                minutos: await tarefas.quantidadeTarefasConcluidasBlocos(inicioAno, fimAno, MEIAHORA),
                manha: await tarefas.quantidadeTarefasConcluidasBlocos(inicioAno, fimAno, MANHA),
                tarde: await tarefas.quantidadeTarefasConcluidasBlocos(inicioAno, fimAno, TARDE),
                noite: await tarefas.quantidadeTarefasConcluidasBlocos(inicioAno, fimAno, NOITE),

            },
            categorias: await tarefas.quantidadeTarefasConcluidasCategoria(inicioAno, fimAno),
        }

        setDados(dadosTarefas)
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

    const mapHorarios = {
        hora: UMAHORA,
        minutos: MEIAHORA,
        manha: MANHA,
        tarde: TARDE,
        noite: NOITE
    }

    const meses = dados.mes.concluidas.map((mes) => mes.quantidade)
    const mesesTotais = dados.mes.totais.map((mes) => mes.quantidade)

    const mesesMaisProdutivos = dados.mes.concluidas.sort((a, b) => {
        return b.quantidade - a.quantidade
    }).slice(0, 4).map((mes) => mes.mes)

    const semanasMaisProdutivas = dados.semana.concluidas.sort((a, b) => {
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

    return (
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
                <Text style={styles.titulo}>Tarefas</Text>
                <Text style={styles.subTitulo}>Total de tarefas</Text>
                <View style={{alignItems: 'flex-end'}}>
                    <TouchableOpacity style={{flexDirection: 'row', backgroundColor: 'blue', borderRadius: 30, padding: '1%', alignItems: 'center'}} onPress={() => setShowPicker(true)}>
                        <MaterialCommunityIcons name="calendar" size={24} color="white"/>
                        <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>{data.getFullYear()}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 200, padding: 20, flexDirection: 'row'}}>
                    <YAxis
                        data={mesesTotais}
                        style={{marginBottom: xAxisHeight}}
                        contentInset={verticalContentInset}
                        svg={axesSvg}
                    />
                    <View style={{flex: 1, marginLeft: 10}}>
                        <LineChart
                            style={{flex: 1}}
                            data={mesesTotais}
                            contentInset={verticalContentInset}
                            svg={{stroke: 'rgb(255,0,0)'}}
                        >
                            <Grid/>
                        </LineChart>
                        <XAxis
                            style={{marginHorizontal: -10, height: xAxisHeight}}
                            data={mesesTotais}
                            formatLabel={(value, index) => mapMeses[index]}
                            contentInset={{left: 10, right: 10}}
                            svg={axesSvg}
                        />
                    </View>
                </View>

                <Text style={styles.subTitulo}>Tarefas concluídas por mês</Text>

                <View style={{height: 200, padding: 20, flexDirection: 'row'}}>
                    <YAxis
                        data={meses}
                        style={{marginBottom: xAxisHeight}}
                        contentInset={verticalContentInset}
                        svg={axesSvg}
                    />
                    <View style={{flex: 1, marginLeft: 10}}>
                        <LineChart
                            style={{flex: 1}}
                            data={meses}
                            contentInset={verticalContentInset}
                            svg={{stroke: 'rgb(134, 65, 244)'}}
                        >
                            <Grid/>
                        </LineChart>
                        <XAxis
                            style={{marginHorizontal: -10, height: xAxisHeight}}
                            data={meses}
                            formatLabel={(value, index) => mapMeses[index]}
                            contentInset={{left: 10, right: 10}}
                            svg={axesSvg}
                        />
                    </View>
                </View>

                <View style={[styles.spaceBetween, {marginBottom: '5%'}]}>
                    <Text style={{color: 'green'}}>Concluídas : {dados.ano.concluidas}</Text>
                    <Text style={{color: 'blue'}}>Totais : {dados.ano.totais}</Text>
                    <Text>Porcentagem: {formatarPorcentagem(dados.ano.concluidas / dados.ano.totais)}</Text>
                </View>

                <View style={[styles.spaceBetween]}>
                    <Text>4 Meses mais produtivos: </Text>
                    <Text style={{color: 'green'}}>{mesesMaisProdutivos.map(element => mapMeses[Number.parseInt(element)] + ", ")}</Text>
                </View>
                <View style={[styles.spaceBetween]}>
                    <Text>4 semanas mais produtivas: </Text>
                    <Text style={{color: 'green'}}>{semanasMaisProdutivas}</Text>
                </View>

                <Text style={[styles.subTitulo, {marginTop: '1%'}]}>Tarefas concluídas por bloco(total):</Text>
                <View style={[styles.spaceBetween, {marginVertical: '3%'}]}>
                    <Text>Manhã: <Text style={{color: 'green'}}>{dados.horarios.manha}</Text></Text>
                    <Text>Tarde: <Text style={{color: 'green'}}>{dados.horarios.tarde}</Text></Text>
                    <Text>Noite: <Text style={{color: 'green'}}>{dados.horarios.noite}</Text></Text>
                    <Text>30 minutos: <Text style={{color: 'green'}}>{dados.horarios.minutos}</Text></Text>
                    <Text>1 hora: <Text style={{color: 'green'}}>{dados.horarios.hora}</Text></Text>
                </View>

                <Text>Seu horário mais produtivo foi <Text style={{color: 'red'}}>{mapHorarios[Object.keys(dados.horarios).reduce((a, b) => dados.horarios[a] > dados.horarios[b] ? a : b)]}</Text></Text>

                <Text style={styles.subTitulo}>Tarefas concluídas por categoria</Text>
                {
                    dados.categorias.map((item, index) => {
                        return (
                            <Text key={item.quantidade + item.bloco + index}>{item.categoria +  " - concluídas " + item.quantidade}</Text>
                        )
                    })
                }

            </ScrollView>

        </View>
    )
}