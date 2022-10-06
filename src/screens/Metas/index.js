import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import styles from './styles';
import Feather from "react-native-vector-icons/Feather";
import {widthPercentageToDP} from "../../util/normalizador";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import Swiper from 'react-native-swiper';
import {CONCLUIDA, PARCIAL} from "../../model/enums/Status";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {formatDate, formatTime} from "../../util/dateFormat";
import { allMetas } from '../../services/MetaService';

export default function Metas() {
    const navigate = useNavigation().navigate;
    const [metas, setMetas] = useState([]);
    const [ordenar, setOrdenar] = useState(true);

    useFocusEffect(useCallback(() => {
        let isActive = true;

        async function init() {
            let metasSalvas = await allMetas();
            setMetas(metasSalvas);
        }

        init()

        return () => {
            isActive = false;
        };
    }, []))

    const metasHoje = metas.filter(meta => {
        const data = new Date(meta.data)
        const hoje = new Date()
        return data.getDate() === hoje.getDate() && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()
    })

    const metasSemana = metas.filter(meta => {
        const data = new Date(meta.data)
        const hoje = new Date()
        return data.getDate() >= hoje.getDate() && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()
    })

    const metasMes = metas.filter(meta => {
        const data = new Date(meta.data)
        const hoje = new Date()
        return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()
    })


    function getStatus(meta) {
        switch (meta.status) {
            case PARCIAL:
                return (
                    <>
                        <Text style={{
                            color: '#FFC107',
                            marginRight: '10%',
                            fontSize: widthPercentageToDP('2.5%')
                        }}>{formatDate(meta.data)}</Text>
                        <FontAwesome5 name={'exclamation-circle'} size={widthPercentageToDP('5%')} color={'#FFC107'}/>
                    </>
                )

            case CONCLUIDA:
                return (
                    <>
                        <Text style={{
                            color: '#4CAF50',
                            marginRight: '10%',
                            fontSize: widthPercentageToDP('2.5%')
                        }}>{formatDate(meta.data)}</Text>
                        <FontAwesome5 name={'check-circle'} size={widthPercentageToDP('5%')} color={'#4CAF50'}/>
                    </>
                )
            case null:
                let data = meta.data
                if (typeof meta.data === 'string') {
                    data = new Date(meta.data)
                }
                if (data < new Date()) {
                    return (
                        <>
                            <Text style={{
                                color: '#F44336',
                                marginRight: '10%',
                                fontSize: widthPercentageToDP('2.5%')
                            }}>{formatDate(meta.data)}</Text>
                            <FontAwesome5 name={'times-circle'} size={widthPercentageToDP('5%')} color={'#F44336'}/>
                        </>
                    )
                }
                return (
                    <>
                        <Text style={{
                            color: '#2196F3',
                            marginRight: '10%',
                            fontSize: widthPercentageToDP('2.5%')
                        }}>{formatDate(meta.data)}</Text>
                        <FontAwesome5 name={'clock'} size={widthPercentageToDP('5%')} color={'#2196F3'}/>
                    </>
                )
        }
    }

    const renderItem = ({item}) => (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigate('Nova Meta', {meta: {...item, data: item.data?.toISOString(), concluida_em: item.concluida_em?.toISOString()}})}>
            <View style={{flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: 'black', fontSize: 15}}>{item.titulo}</Text>
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
                    <Text style={{color: 'black', fontSize: 15}}>{item.categoria.nome}</Text>
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
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Swiper style={styles.wrapper}>
                <View style={styles.slide1}>
                    <View style={{justifyContent: 'space-between'}}>
                        <Text>Hoje</Text>
                        <TouchableOpacity onPress={() => setOrdenar(!ordenar)}>
                            <Feather name={'filter'} size={widthPercentageToDP('5%')} color={'#000'}/>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={ordenar ?
                            [...metasHoje].sort((a, b) => {
                                if (a.categoria.nome < b.categoria.nome) {
                                    return -1;
                                }
                                if (a.categoria.nome > b.categoria.nome) {
                                    return 1;
                                }
                                return 0;
                            })
                            : metasHoje}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={styles.slide2}>
                    <View style={{justifyContent: 'space-between'}}>
                        <Text>Esta semana</Text>
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
                <View style={styles.slide3}>
                    <View style={{justifyContent: 'space-between'}}>
                        <Text>Este mês</Text>
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
                <View style={styles.slide4}>
                    <View style={{justifyContent: 'space-between'}}>
                        <Text>Todas</Text>
                        <TouchableOpacity onPress={() => setOrdenar(!ordenar)}>
                            <Feather name={'filter'} size={widthPercentageToDP('5%')} color={'#000'}/>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={ordenar ?
                            [...metas].sort((a, b) => {
                                if (a.categoria.nome < b.categoria.nome) {
                                    return -1;
                                }
                                if (a.categoria.nome > b.categoria.nome) {
                                    return 1;
                                }
                                return 0;
                            })
                            : metas}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            </Swiper>
            <TouchableOpacity onPress={() => navigate('Nova Meta')} style={styles.addButton}>
                <Feather name={'plus'} size={widthPercentageToDP('6%')} color={'white'}/>
            </TouchableOpacity>
        </View>
    );
}