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

export default function Estatisticas() {
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



    const metasMeses = dadosMeta.mes.concluidas.map((mes) => mes.quantidade)
    const metasMesesTotais = dadosMeta.mes.totais.map((mes) => mes.quantidade)

    const metasMesesMaisProdutivos = dadosMeta.mes.concluidas.sort((a, b) => {
        return b.quantidade - a.quantidade
    }).slice(0, 4).map((mes) => mes.mes)

    const metasSemanasMaisProdutivas = dadosMeta.semana.concluidas.sort((a, b) => {
        return b.quantidade - a.quantidade
    }).slice(0, 4).map((mes) => mes.semana + "ª de " + mapMeses[Number.parseInt(mes.mes)] + ` - ${mes.quantidade} metas\n`)

    useFocusEffect(useCallback(() => {
        let isActive = true;

        async function initData() {
            let tarefasConcluidasMeses = await tarefas.quantidadeTarefasConcluidasMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString())
            let metasConcluidasMeses = await metas.quantidadeMetasConcluidasMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString())

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

            const dadosTarefas = {
                ano: {
                    concluidas: await tarefas.quantidadeTarefasConcluidasAno(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                    totais: await tarefas.quantidadeTarefasAno(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                },
                mes: {
                    concluidas: tarefasConcluidasMeses,
                    totais: await tarefas.quantidadeTarefasMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                },
                semana: {
                    concluidas: await tarefas.quantidadeTarefasConcluidasSemanaMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                    totais: await tarefas.quantidadeTarefasSemanaMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                },
                horarios: {
                    hora: await tarefas.quantidadeTarefasConcluidasBlocos(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), UMAHORA),
                    minutos: await tarefas.quantidadeTarefasConcluidasBlocos(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), MEIAHORA),
                    manha: await tarefas.quantidadeTarefasConcluidasBlocos(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), MANHA),
                    tarde: await tarefas.quantidadeTarefasConcluidasBlocos(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), TARDE),
                    noite: await tarefas.quantidadeTarefasConcluidasBlocos(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), NOITE),

                },
                categorias: await tarefas.quantidadeTarefasConcluidasCategoria(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
            }

            const dadosMetas = {
                ano: {
                    concluidas: await metas.quantidadeMetasConcluidasAno(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                    totais: await metas.quantidadeMetasAno(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                },
                mes: {
                    concluidas: metasConcluidasMeses,
                    totais: await metas.quantidadeMetasMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                },
                semana: {
                    concluidas: await metas.quantidadeMetasConcluidasSemanaMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                    totais: await metas.quantidadeMetasSemanaMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                },
                tipos : await metas.quantidadeMetasConcluidasTipo(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                categorias: await metas.quantidadeMetasConcluidasCategoria(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString())
            }

            console.log(dadosMetas)
            setDados(dadosTarefas)
            setDadosMeta(dadosMetas)
        }

        initData()

        return () => {
            isActive = false;
        };
    }, []))

    const axesSvg = {fontSize: 13, fill: 'grey'};
    const verticalContentInset = {top: 10, bottom: 10}
    const xAxisHeight = 20

    // Layout of an x-axis together with a y-axis is a problem that stems from flexbox.
    // All react-native-svg-charts components support full flexbox and therefore all
    // layout problems should be approached with the mindset "how would I layout regular Views with flex in this way".
    // In order for us to align the axes correctly we must know the height of the x-axis or the width of the x-axis
    // and then displace the other axis with just as many pixels. Simple but manual.

    //get the max value of the array to update

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
        <>
            <Swiper>
                <View style={{padding: '3%'}}>
                    <ScrollView>
                        <Text style={styles.titulo}>Tarefas</Text>
                        <Text style={styles.subTitulo}>Total de tarefas</Text>
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
                                    <Text key={item.quantidade + item.quantidade + index}>{item.categoria +  " - concluídas " + item.quantidade}</Text>
                                )
                            })
                        }

                    </ScrollView>

                </View>
                <View style={{padding: '3%'}}>
                    <ScrollView>
                        <Text style={styles.titulo}>Metas</Text>
                        <Text style={styles.subTitulo}>Total de metas</Text>
                        <View style={{height: 200, padding: 20, flexDirection: 'row'}}>
                            <YAxis
                                data={metasMesesTotais}
                                style={{marginBottom: xAxisHeight}}
                                contentInset={verticalContentInset}
                                svg={axesSvg}
                            />
                            <View style={{flex: 1, marginLeft: 10}}>
                                <LineChart
                                    style={{flex: 1}}
                                    data={metasMesesTotais}
                                    contentInset={verticalContentInset}
                                    svg={{stroke: 'rgb(255,0,0)'}}
                                >
                                    <Grid/>
                                </LineChart>
                                <XAxis
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
                                data={metasMeses}
                                style={{marginBottom: xAxisHeight}}
                                contentInset={verticalContentInset}
                                svg={axesSvg}
                            />
                            <View style={{flex: 1, marginLeft: 10}}>
                                <LineChart
                                    style={{flex: 1}}
                                    data={metasMeses}
                                    contentInset={verticalContentInset}
                                    svg={{stroke: 'rgb(134, 65, 244)'}}
                                >
                                    <Grid/>
                                </LineChart>
                                <XAxis
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
            </Swiper>

        </>

    )
}
