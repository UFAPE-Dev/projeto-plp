import React, {useState, useEffect} from 'react'
import {BarChart, Grid, LineChart, XAxis, YAxis} from 'react-native-svg-charts'
import {View, Text} from 'react-native'
import * as scale from 'd3-scale'
import * as tarefas from "../../util/tarefas";
import * as metas from "../../util/metas";
import {MANHA, MEIAHORA, NOITE, TARDE, UMAHORA} from "../../model/enums/Bloco";
import {formatarPorcentagem} from "../../util/formatarPorcentagem";

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

    const mesesMaisProdutivos = dados.mes.concluidas.sort((a, b) => {
        return b.quantidade - a.quantidade
    }).slice(0, 4).map((mes) => mes.mes)

    const semanasMaisProdutivas = dados.semana.concluidas.sort((a, b) => {
        return b.quantidade - a.quantidade
    }).slice(0, 4).map((mes) => "Semana " + mes.semana + " do mês " + mapMeses[Number.parseInt(mes.mes)] + ` com ${mes.quantidade} tarefas concluídas\n`)

    useEffect(() => {
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

            console.log(dadosMetas.categorias)

            setDados(dadosTarefas)


        }

        initData()
    }, [])

    const axesSvg = {fontSize: 15, fill: 'grey'};
    const verticalContentInset = {top: 10, bottom: 10}
    const xAxisHeight = 30

    // Layout of an x-axis together with a y-axis is a problem that stems from flexbox.
    // All react-native-svg-charts components support full flexbox and therefore all
    // layout problems should be approached with the mindset "how would I layout regular Views with flex in this way".
    // In order for us to align the axes correctly we must know the height of the x-axis or the width of the x-axis
    // and then displace the other axis with just as many pixels. Simple but manual.

    //get the max value of the array to update
    return (
        <>
            <Text>Quantidade anual(Concluídas) : {dados.ano.concluidas}</Text>
            <Text>Quantidade anual(Totais) : {dados.ano.totais}</Text>
            <Text>Porcentagem de conclusão anual : {formatarPorcentagem(dados.ano.concluidas / dados.ano.totais)}</Text>
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
            <Text>Os quatro meses mais produtivos
                foram: {mesesMaisProdutivos.map(element => mapMeses[Number.parseInt(element)] + ", ")}</Text>
            <Text>As quatro semanas mais produtivos foram: </Text>
            <Text>{semanasMaisProdutivas}</Text>
            <Text>Quantidade de tarefas concluidas por blocos(total no BD): </Text>
            <Text>Manhã: {dados.horarios.manha}</Text>
            <Text>Tarde: {dados.horarios.tarde}</Text>
            <Text>Noite: {dados.horarios.noite}</Text>
            <Text>30 minutos: {dados.horarios.minutos}</Text>
            <Text>1 hora: {dados.horarios.hora}</Text>
            <Text>Seu horário mais produtivo foi {mapHorarios[Object.keys(dados.horarios).reduce((a, b) => dados.horarios[a] > dados.horarios[b] ? a : b)]}</Text>
        </>

    )
}
