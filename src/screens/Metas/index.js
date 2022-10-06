import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//import styles from './styles';
import Feather from "react-native-vector-icons/Feather";
import {widthPercentageToDP} from "../../util/normalizador";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import Swiper from 'react-native-swiper';
import {CONCLUIDA, PARCIAL} from "../../model/enums/Status";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {formatDate, formatTime} from "../../util/dateFormat";
import {allMetas} from "../../services/MetaService";
import {ANUAL, DIARIA, MENSAL, SEMANAL} from "../../model/enums/Tipo";

export default function Tarefas() {
    const navigate = useNavigation().navigate;
    const [metas, setMetas] = useState([]);
    const [ordenar, setOrdenar] = useState(false);

    useFocusEffect(useCallback(() => {
        let isActive = true;

        async function init() {
            const metas = await allMetas()
            setMetas(metas)
        }

        init()

        return () => {
            isActive = false;
        };
    }, []))



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

    //filter metas for today
    const metasAnuais = metas.filter(meta => {
        return meta.tipo === ANUAL
    })

    //filter metas for this week
    const metasSemana = metas.filter(meta => {
        return meta.tipo === SEMANAL
    })

    //filter metas for this week
    const metasDiario = metas.filter(meta => {
        return meta.tipo === DIARIA
    })

    //filter metas for this month
    const metasMes = metas.filter(meta => {
        return meta.tipo === MENSAL
    })

    const mapMeses = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ]

    function getWeek(data = new Date()) {
        const d = data ;
        const date = d.getDate();
        const day = d.getDay();
        return Math.ceil((date - 1 - day) / 7);
    }

    function getStatus(meta) {
        switch (meta.status) {
            case PARCIAL:
                return (
                    <>
                        <FontAwesome5 name={'exclamation-circle'} size={widthPercentageToDP('5%')} color={'#FFC107'}/>
                        <Text style={{
                            color: '#FFC107',
                            fontSize: widthPercentageToDP('2.5%'),
                            fontWeight: 'bold'
                        }}>{formatDate(meta.data)} - </Text>
                        <Text style={{
                            color: '#FFC107',
                            fontSize: widthPercentageToDP('2.5%'),
                            fontWeight: 'bold'
                        }}>{formatTime(meta.data)}</Text>
                    </>
                )

            case CONCLUIDA:
                return (
                    <>
                        <FontAwesome5 name={'check-circle'} size={widthPercentageToDP('5%')} color={'#4CAF50'}/>
                        <Text style={{
                            color: '#4CAF50',
                            fontWeight: 'bold',
                            fontSize: widthPercentageToDP('2.5%')
                        }}>{formatDate(meta.data)} - </Text>

                        <Text style={{
                            color: '#4CAF50',
                            fontSize: widthPercentageToDP('2.5%')
                        }}>{formatTime(meta.data)}</Text>
                    </>
                )
            case null:
                const texto = (tipo, data) => {
                    switch (tipo) {
                        case ANUAL:
                            return 'Concluir até o ano ' + data.getFullYear()
                        case MENSAL:
                            return 'Concluir até o mês ' + mapMeses[data.getMonth()] + ' de ' + data.getFullYear()
                        case SEMANAL:
                            return 'Concluir até a semana ' + getWeek(data) +  ' de ' +formatDate(data)
                        case DIARIA:
                            return 'Concluir até o dia ' + formatDate(data)
                    }
                }
                let data = meta.data
                if (typeof meta.data === 'string') {
                    data = new Date(meta.data)
                }
                let atrasada = false
                switch (meta.tipo) {
                    case ANUAL:
                    atrasada = data.getFullYear() < new Date().getFullYear()
                        break;
                    case MENSAL:
                        atrasada = data.getMonth() < new Date().getMonth() && data.getFullYear() <= new Date().getFullYear()
                        break;
                    case SEMANAL:
                        atrasada = data < new Date()
                        break;
                    case DIARIA:
                        atrasada = data < new Date()
                        break;
                }
                if (atrasada) {
                    return (
                        <>
                            <FontAwesome5 name={'times-circle'} size={widthPercentageToDP('5%')} color={'#F44336'}/>
                            <Text style={{
                                color: '#F44336',
                                fontWeight: 'bold',
                                fontSize: widthPercentageToDP('2.5%')
                            }}>{texto(meta.tipo, meta.data)}</Text>

                        </>
                    )
                }
                return (
                    <>
                        <FontAwesome5 name={'clock'} size={widthPercentageToDP('5%')} color={'#2196F3'}/>
                        <Text style={{
                            color: '#2196F3',
                            fontWeight: 'bold',
                            fontSize: widthPercentageToDP('2.5%')
                        }}>{texto(meta.tipo, meta.data)}</Text>
                    </>
                )
        }
    }

    const renderItem = ({item}) => (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigate('Nova Meta', {
                meta: {
                    ...item,
                    data: item.data?.toISOString(),
                    concluida_em: item.concluida_em?.toISOString()
                }
            })}>
            <View style={{flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>{item.titulo}</Text>
                <Text style={{color: 'black', fontSize: 10}}>({item.tipo})</Text>
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
                            <Text style={{fontWeight: 'bold', fontSize: 17}}>Metais anuais</Text>
                            <TouchableOpacity onPress={() => setOrdenar(!ordenar)}>
                                <Feather name={'filter'} size={widthPercentageToDP('5%')} color={'#000'}/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={ordenar ?
                                [...metasAnuais].sort((a, b) => {
                                    if (a.categoria.nome < b.categoria.nome) {
                                        return -1;
                                    }
                                    if (a.categoria.nome > b.categoria.nome) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                : metasAnuais}
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
                            <Text style={{fontWeight: 'bold', fontSize: 17}}>Metais diárias</Text>
                            <TouchableOpacity onPress={() => setOrdenar(!ordenar)}>
                                <Feather name={'filter'} size={widthPercentageToDP('5%')} color={'#000'}/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={ordenar ?
                                [...metasDiario].sort((a, b) => {
                                    if (a.categoria.nome < b.categoria.nome) {
                                        return -1;
                                    }
                                    if (a.categoria.nome > b.categoria.nome) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                : metasDiario}
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
                            <Text style={{fontWeight: 'bold', fontSize: 17}}>Metas semanais</Text>
                            <TouchableOpacity onPress={() => setOrdenar(!ordenar)}>
                                <Feather name={'filter'} size={widthPercentageToDP('5%')} color={'#000'}/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={ordenar ?
                                [...metasSemana].sort((a, b) => {
                                    if (a.categoria.nome < b.categoria.nome) {
                                        return -1;
                                    }
                                    if (a.categoria.nome > b.categoria.nome) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                : metasSemana}
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
                            <Text style={{fontWeight: 'bold', fontSize: 17}}>Metas mensais</Text>
                            <TouchableOpacity onPress={() => setOrdenar(!ordenar)}>
                                <Feather name={'filter'} size={widthPercentageToDP('5%')} color={'#000'}/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={ordenar ?
                                [...metasMes].sort((a, b) => {
                                    if (a.categoria.nome < b.categoria.nome) {
                                        return -1;
                                    }
                                    if (a.categoria.nome > b.categoria.nome) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                : metasMes}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </Swiper>
            </View>

            <TouchableOpacity onPress={() => navigate('Nova Meta')} style={styles.addButton}>
                <Feather name={'plus'} size={widthPercentageToDP('6%')} color={'white'}/>
            </TouchableOpacity>
        </View>
    );
}