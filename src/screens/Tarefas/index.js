import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
//import styles from './styles';
import Feather from "react-native-vector-icons/Feather";
import {widthPercentageToDP} from "../../util/normalizador";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import Swiper from 'react-native-swiper';
import {allTarefas} from "../../services/TarefaService";
import {CONCLUIDA, PARCIAL} from "../../model/enums/Status";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {formatDate, formatTime} from "../../util/dateFormat";
import {allLembretes, createLembrete, updateLembrete} from "../../services/LembreteService";
import Input from "../../components/Input";
import Button from "../../components/Button";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import exibirToast from "../../util/toastAndroid";

export default function Tarefas() {
    const navigate = useNavigation().navigate;
    const [tarefas, setTarefas] = useState([]);
    const [ordenar, setOrdenar] = useState(false);
    const [lembretes, setLembretes] = useState([]);
    const [lembrete, setLembrete] = useState('')


    useFocusEffect(useCallback(() => {
        let isActive = true;

        async function init() {
            const tarefas = await allTarefas()
            setTarefas(tarefas)

            await initLembretes()
        }

        init()

        return () => {
            isActive = false;
        };
    }, []))

    async function initLembretes() {
        const lembretes = await allLembretes()
        setLembretes(lembretes)
    }

    const styles = StyleSheet.create({
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

    //filter tarefas for today
    const tarefasHoje = tarefas.filter(tarefa => {
        const data = new Date(tarefa.data_fim)
        const hoje = new Date()
        return data.getDate() === hoje.getDate() && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()
    })

    //filter tarefas for this week
    const tarefasSemana = tarefas.filter(tarefa => {
        const data = new Date(tarefa.data_fim)
        const hoje = new Date()
        return data.getDate() >= hoje.getDate() && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()
    })

    //filter tarefas for this month
    const tarefasMes = tarefas.filter(tarefa => {
        const data = new Date(tarefa.data_fim)
        const hoje = new Date()
        return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()
    })

    function getStatus(tarefa) {
        switch (tarefa.status) {
            case PARCIAL:
                return (
                    <>
                        <Text style={{
                            color: '#FFC107',
                            marginRight: '10%',
                            fontSize: widthPercentageToDP('2.5%'),
                            fontWeight: 'bold'
                        }}>{formatDate(tarefa.data_inicio)}</Text>
                        <FontAwesome5 name={'exclamation-circle'} size={widthPercentageToDP('5%')} color={'#FFC107'}/>
                        <Text style={{
                            color: '#FFC107',
                            fontSize: widthPercentageToDP('2.5%'),
                            fontWeight: 'bold'
                        }}>{formatTime(tarefa.data_inicio)} até {formatTime(tarefa.data_fim)}</Text>
                    </>
                )

            case CONCLUIDA:
                return (
                    <>
                        <Text style={{
                            color: '#4CAF50',
                            marginRight: '10%',
                            fontWeight: 'bold',
                            fontSize: widthPercentageToDP('2.5%')
                        }}>{formatDate(tarefa.data_inicio)}</Text>
                        <FontAwesome5 name={'check-circle'} size={widthPercentageToDP('5%')} color={'#4CAF50'}/>
                        <Text style={{
                            color: '#4CAF50',
                            fontSize: widthPercentageToDP('2.5%')
                        }}>{formatTime(tarefa.data_inicio)} até {formatTime(tarefa.data_fim)}</Text>
                    </>
                )
            case null:
                let data = tarefa.data_fim
                if (typeof tarefa.data_fim === 'string') {
                    data = new Date(tarefa.data_fim)
                }
                if (data < new Date()) {
                    return (
                        <>
                            <Text style={{
                                color: '#F44336',
                                marginRight: '10%',
                                fontWeight: 'bold',
                                fontSize: widthPercentageToDP('2.5%')
                            }}>{formatDate(tarefa.data_inicio)}</Text>
                            <FontAwesome5 name={'times-circle'} size={widthPercentageToDP('5%')} color={'#F44336'}/>
                            <Text style={{
                                color: '#F44336',
                                fontWeight: 'bold',
                                fontSize: widthPercentageToDP('2.5%')
                            }}>{formatTime(tarefa.data_inicio)} até {formatTime(tarefa.data_fim)}</Text>
                        </>
                    )
                }
                return (
                    <>
                        <Text style={{
                            color: '#2196F3',
                            marginRight: '10%',
                            fontWeight: 'bold',
                            fontSize: widthPercentageToDP('2.5%')
                        }}>{formatDate(tarefa.data_inicio)}</Text>
                        <FontAwesome5 name={'clock'} size={widthPercentageToDP('5%')} color={'#2196F3'}/>
                        <Text style={{
                            color: '#2196F3',
                            fontWeight: 'bold',
                            fontSize: widthPercentageToDP('2.5%')
                        }}>{formatTime(tarefa.data_inicio)} até {formatTime(tarefa.data_fim)}</Text>
                    </>
                )
        }
    }

    const renderItem = ({item}) => (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigate('Nova Tarefa', {
                tarefa: {
                    ...item,
                    data_inicio: item.data_inicio?.toISOString(),
                    data_fim: item.data_fim?.toISOString(),
                    concluida_em: item.concluida_em?.toISOString()
                }
            })}>
            <View style={{flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>{item.titulo}</Text>
                <Text style={{color: 'black', fontSize: 10}}>({item.bloco})</Text>
            </View>
            <View style={{
                flex: 1,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <View style={{
                    width: '30%',
                    backgroundColor: item.categoria.cor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 50
                }}>
                    <Text style={{color: 'white', fontSize: 15}}>{item.categoria.nome}</Text>
                </View>
                <View style={{width: '45%'}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        {getStatus(item)}
                    </View>
                </View>
            </View>
        </TouchableOpacity>

    )

    async function handleUpdateLembrete(lembrete) {
        await updateLembrete({...lembrete, concluida_em: null})
        await initLembretes()
        exibirToast('Lembrete desmarcado com concluído com sucesso!')
    }

    async function handleUpdateLembreteN(lembrete) {
        await updateLembrete({...lembrete, concluida_em: new Date().toISOString()})
        await initLembretes()
        exibirToast("Lembrete concluído com sucesso!")
    }

    const renderItemLembrete = ({item}) => (
        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginTop: '2%', marginRight: '2%', borderRadius: 15}}>
            <TouchableOpacity
                onPress={(a) => {
                    handleUpdateLembreteN(item)
                }}>
                <MaterialCommunityIcons name={'checkbox-blank-outline'} size={25}/>
            </TouchableOpacity>
            <Text style={{maxWidth: '90%'}}>{item.descricao}</Text>
        </View>
    )

    const renderItemLembreteN = ({item}) => (
        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginTop: '2%', marginRight: '2%', borderRadius: 15}}>
            <TouchableOpacity
                onPress={(a) => {
                    handleUpdateLembrete(item)
                }}
            >
                <Ionicons name={'checkbox'} size={25} color={'#1492E6'}/>
            </TouchableOpacity>
            <Text>{item.descricao}</Text>
        </View>
    )

    async function adicionarLembrete() {
        if(lembrete.length > 0) {
            await createLembrete({descricao: lembrete, concluida_em: null, data: new Date().toISOString()})
            await initLembretes()
            setLembrete('')
            exibirToast("Lembrete adicionado com sucesso!")
        }else {
            exibirToast("Preencha o campo de lembrete")
        }

    }


    return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white'}}>
            <View style={{flex: 1}}>
                <Swiper style={styles.wrapper}>
                    <View style={{
                        padding: '3%',
                        margin: '2%',
                        backgroundColor: '#EFEFEF',
                        borderRadius: 30,
                        height: '100%'
                    }}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 17}}>Hoje</Text>
                            <TouchableOpacity onPress={() => setOrdenar(!ordenar)}>
                                <Feather name={'filter'} size={widthPercentageToDP('5%')} color={'#000'}/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={ordenar ?
                                [...tarefasHoje].sort((a, b) => {
                                    if (a.categoria.nome < b.categoria.nome) {
                                        return -1;
                                    }
                                    if (a.categoria.nome > b.categoria.nome) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                : tarefasHoje}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View style={{
                        padding: '3%',
                        margin: '2%',
                        backgroundColor: '#EFEFEF',
                        borderRadius: 30,
                        height: '100%'
                    }}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 17}}>Esta semana</Text>
                            <TouchableOpacity onPress={() => setOrdenar(!ordenar)}>
                                <Feather name={'filter'} size={widthPercentageToDP('5%')} color={'#000'}/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={ordenar ?
                                [...tarefasSemana].sort((a, b) => {
                                    if (a.categoria.nome < b.categoria.nome) {
                                        return -1;
                                    }
                                    if (a.categoria.nome > b.categoria.nome) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                : tarefasSemana}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View style={{
                        padding: '3%',
                        margin: '2%',
                        backgroundColor: '#EFEFEF',
                        borderRadius: 30,
                        height: '100%'
                    }}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 17}}>Este mês</Text>
                            <TouchableOpacity onPress={() => setOrdenar(!ordenar)}>
                                <Feather name={'filter'} size={widthPercentageToDP('5%')} color={'#000'}/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={ordenar ?
                                [...tarefasMes].sort((a, b) => {
                                    if (a.categoria.nome < b.categoria.nome) {
                                        return -1;
                                    }
                                    if (a.categoria.nome > b.categoria.nome) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                : tarefasMes}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View style={{
                        padding: '3%',
                        margin: '2%',
                        backgroundColor: '#EFEFEF',
                        borderRadius: 30,
                        height: '100%'
                    }}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 17}}>Todas</Text>
                            <TouchableOpacity onPress={() => setOrdenar(!ordenar)}>
                                <Feather name={'filter'} size={widthPercentageToDP('5%')} color={'#000'}/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={ordenar ?
                                [...tarefas].sort((a, b) => {
                                    if (a.categoria.nome < b.categoria.nome) {
                                        return -1;
                                    }
                                    if (a.categoria.nome > b.categoria.nome) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                : tarefas}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </Swiper>
            </View>

            <View style={{flex: 1, padding: '3%'}}>
                <Text style={{fontWeight: 'bold', fontSize: 17}}>Lembretes</Text>
                <View style={{flex: 1, backgroundColor: '#EFEFEF',
                    borderRadius: 10, padding: '1%'}}>
                    <FlatList data={lembretes.filter(el => el.concluida_em == null)} renderItem={renderItemLembrete}
                              keyExtractor={item => item.id}/>

                </View>
                <Text style={{fontWeight: 'bold', fontSize: 17}}>Concluídos</Text>
                <View style={{flex: 1, backgroundColor: '#EFEFEF',
                    borderRadius: 10, padding: '1%'}}>
                    <FlatList data={lembretes.filter(el => el.concluida_em != null)} renderItem={renderItemLembreteN}
                              keyExtractor={item => item.id}/>
                </View>
                <View style={{flex: 1}}>
                    <Input placeholder={"Informe um texto para salvar um novo lembrete"} title={'Lembrete'} value={lembrete} onChangeText={setLembrete}/>
                    <Button color={'orange'} onPress={adicionarLembrete}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Adicionar lembrete</Text>
                    </Button>
                </View>
            </View>

            <TouchableOpacity onPress={() => navigate('Nova Tarefa')} style={styles.addButton}>
                <Feather name={'plus'} size={widthPercentageToDP('6%')} color={'white'}/>
            </TouchableOpacity>
        </View>
    );
}