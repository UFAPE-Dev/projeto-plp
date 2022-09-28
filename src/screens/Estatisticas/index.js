import React, {useState, useEffect} from 'react'
import {BarChart, Grid, LineChart, XAxis, YAxis} from 'react-native-svg-charts'
import { View, Text } from 'react-native'
import * as scale from 'd3-scale'
import * as tarefas from  "../../util/tarefas";
import {DESBLOCADO, MANHA, MEIAHORA, NOITE, TARDE, UMAHORA} from "../../model/enums/Bloco";
import {formatarPorcentagem} from "../../util/formatarPorcentagem";

export default function Estatisticas() {
    const [dados, setDados] = useState({
        ano : {
            concluidas: [],
            totais: []
        },
        mes : {
            concluidas: [],
            totais: []
        },
        semana : {
            concluidas: [],
            totais: []
        },
        categorias: {
            "1 hora" : 0,
            "30 minutos" : 0,
            "Desblocado" : 0,
            "Manha" : 0,
            "Tarde" : 0,
            "Noite" : 0,

        }
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

    const meses = dados.mes.concluidas.map((mes) => mes.quantidade)
    const mesesMaisProdutivos = dados.mes.concluidas.sort((a, b) => b.quantidade > a.quantidade).slice(0, 4).map((mes) => mes.mes)
    console.log(mesesMaisProdutivos)

    useEffect(() => {
        async function initData () {
            const dadosTarefas = {
                ano : {
                    concluidas: await tarefas.quantidadeTarefasConcluidasAno(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                    totais: await tarefas.quantidadeTarefasAno(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                },
                mes : {
                    concluidas: await tarefas.quantidadeTarefasConcluidasMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                    totais: await tarefas.quantidadeTarefasMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                },
                semana : {
                    concluidas: await tarefas.quantidadeTarefasConcluidasSemanaMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                    totais: await tarefas.quantidadeTarefasSemanaMes(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString()),
                },
                categorias: {
                    "1 hora" : await tarefas.quantidadeTarefasConcluidasCategoria(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), UMAHORA),
                    "30 minutos" : await tarefas.quantidadeTarefasConcluidasCategoria(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), MEIAHORA),
                    "Desblocado" : await tarefas.quantidadeTarefasConcluidasCategoria(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), DESBLOCADO),
                    "Manha" : await tarefas.quantidadeTarefasConcluidasCategoria(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), MANHA),
                    "Tarde" : await tarefas.quantidadeTarefasConcluidasCategoria(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), TARDE),
                    "Noite" : await tarefas.quantidadeTarefasConcluidasCategoria(new Date(2020, 0, 1).toISOString(), new Date(2024, 1, 1).toISOString(), NOITE),

                }
            }

            console.log(dadosTarefas)

            setDados(dadosTarefas)


        }
        initData()
    }, [])

    const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]

    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 30

    // Layout of an x-axis together with a y-axis is a problem that stems from flexbox.
    // All react-native-svg-charts components support full flexbox and therefore all
    // layout problems should be approached with the mindset "how would I layout regular Views with flex in this way".
    // In order for us to align the axes correctly we must know the height of the x-axis or the width of the x-axis
    // and then displace the other axis with just as many pixels. Simple but manual.

    return (
        <>
            <Text>Quantidade anual(Concluídas) : {dados.ano.concluidas}</Text>
            <Text>Quantidade anual(Totais) : {dados.ano.totais}</Text>
            <Text>Porcentagem de conclusão anual : {formatarPorcentagem(dados.ano.concluidas / dados.ano.totais)}</Text>
            <View style={{ height: 200, padding: 20, flexDirection: 'row' }}>
                <YAxis
                    data={meses}
                    style={{ marginBottom: xAxisHeight }}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={meses}
                        contentInset={verticalContentInset}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                    <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={meses}
                        formatLabel={(value, index) => mapMeses[index]}
                        contentInset={{ left: 10, right: 10 }}
                        svg={axesSvg}
                    />
                </View>
            </View>
            <Text>Os quatro meses mais produtivos foram: {mesesMaisProdutivos.map(element => mapMeses[Number.parseInt(element)] + ", ")}</Text>
        </>

    )
}
