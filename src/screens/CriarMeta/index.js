import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Card from "../../components/Card";
import Input from "../../components/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import {Picker} from '@react-native-picker/picker';
import {ANUAL, MENSAL, SEMANAL} from "../../model/enums/Tipo";
import {allCategorias, createCategoria} from "../../services/CategoriaService";
import {formatDate} from "../../util/dateFormat";
import Meta from "../../model/models/Meta";
import {concluirMetaParcialmente, createMeta, deleteMeta, concluirMeta, updateMeta} from "../../services/MetaService";
import exibirToast from "../../util/toastAndroid";
import Button from "../../components/Button";
import {useNavigation} from "@react-navigation/native";
import Modal from "../../components/Modal";
import {ColorPicker, fromHsv} from 'react-native-color-picker'
import Categoria from "../../model/models/Categoria";
import {CONCLUIDA, PARCIAL} from "../../model/enums/Status";
import styles from './styles';
import Feather from "react-native-vector-icons/Feather";
import {widthPercentageToDP} from "../../util/normalizador";


function getMeta(meta) {
    let data = meta.data ? new Date(meta.data) : null;
    let concluida_em = meta.concluida_em ? new Date(meta.concluida_em) : null;
    return {...meta, data: data, data_fim: null, concluida_em: concluida_em}
}

export default function CriarMeta({route}) {
    const meta = route.params ? getMeta(route.params.meta) : null
    const meta_id = meta?.id
    const [geralInfo, setGeralInfo] = useState({...{data: new Date(), id_categoria: 1}, ...meta});
    const [categoriaInfo, setCategoriaInfo] = useState({nome: "", cor: "#ff0000"});
    const [showPicker, setShowPicker] = useState(false)
    const [categorias, setCategorias] = useState([])
    const goBack = useNavigation().goBack
    const [modalVisible, setModalVisible] = useState(false)


    async function initData() {
        let categorias = await allCategorias()
        setCategorias(categorias)
    }

    useEffect(() => {
        initData()
    }, [])

    function validations() {
        return geralInfo.id_categoria && geralInfo.data && geralInfo.tipo && geralInfo.titulo && geralInfo.descricao
    }

    function validationsCategoria() {
        return categoriaInfo.nome && categoriaInfo.cor
    }

    function handleGeralInput(name) {
        return (value) => {
            setGeralInfo((oldGeralInfo) => ({...oldGeralInfo, [name]: value}));
        };
    }

    function handleGeralCategoriaInput(name) {
        return (value) => {
            if (name === "cor") {
                value = fromHsv(value)
            }
            setCategoriaInfo((oldGeralInfo) => ({...oldGeralInfo, [name]: value}));
        };
    }

    const onChange = (event, selectedDate) => {
        if (!selectedDate) {
            setGeralInfo((oldGeralInfo) => ({...oldGeralInfo, data: geralInfo.data}));
        } else {
            setGeralInfo((oldGeralInfo) => ({...oldGeralInfo, data: selectedDate}));
        }
        setShowPicker(false)

    }

    const renderCategoriaList = () => {
        return categorias.map((item) => {
            return <Picker.Item key={item.id} label={item.nome} value={item.id}/>
        })
    }

    const renderTiposList = () => {
        let a = [SEMANAL, MENSAL, ANUAL]
        return a.map((item) => {
            return <Picker.Item key={item} label={item} value={item}/>
        })
    }

    async function criarMeta() {
        if (meta) {
            let meta = new Meta(geralInfo)
            meta.id = meta_id
            meta.data = meta.data.toISOString()
            await updateMeta(meta)
            exibirToast("Meta atualizada com sucesso!")
            goBack()
        } else {
            if (validations()) {
                let meta = new Meta(geralInfo)
                meta.data = meta.data.toISOString()
                meta = await createMeta(meta)
                exibirToast('Meta criada com sucesso!')
                goBack()
            } else {
                exibirToast("Preencha todos os campos")
            }
        }

    }

    async function salvarCategoria() {
        if (validationsCategoria()) {
            let categoria = new Categoria(categoriaInfo)
            categoria = await createCategoria(categoria)
            exibirToast('Categoria criada com sucesso!')
            await initData()
            setModalVisible(false)
        } else {
            exibirToast("Preencha todos os campos")
        }
    }

    async function excluiMeta() {
        await deleteMeta(meta_id)
        exibirToast('Meta excluída com sucesso!')
        goBack()
    }

    async function concluirMetaParcialmenteHold() {
        await concluirMetaParcialmente({id: meta_id, status: PARCIAL})
        exibirToast('Meta concluída parcialmente com sucesso!')
        goBack()
    }

    async function concluirMetaHold() {
        let tarefa = await concluirMeta({id: meta_id, status: CONCLUIDA, concluida_em: new Date().toISOString()})
        exibirToast('Meta concluída com sucesso!')
        goBack()
    }

    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '3%',
            width: '100%',
            maxHeight: "68%"
        }}>
            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={geralInfo.data}
                    mode={'date'}
                    onChange={(event, date) => onChange(event, date, null)}
                />
            )}
            <Modal title={"Criar nova categoria"} visible={modalVisible}
                   modalToggle={() => setModalVisible(!modalVisible)}>
                <View style={{
                    padding: "3%",
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: "center",
                    width: '100%',
                    maxHeight: "65%"
                }}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Input
                            defaultValue={categoriaInfo.nome}
                            onChangeText={handleGeralCategoriaInput("nome")}
                            title={"Nome"}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <ColorPicker
                            onColorSelected={handleGeralCategoriaInput("cor")}
                            onColorChange={handleGeralCategoriaInput("cor")}
                            defaultColor={categoriaInfo.cor}
                            style={{flex: 1}}
                        />
                    </View>
                </View>
                <Button color={"red"} onPress={salvarCategoria}>
                    <Text style={{color: 'white'}}>Salvar</Text>
                </Button>
            </Modal>
            <Card
                title={"Criar nova meta"}
                contentStyle={{padding: '3%', justifyContent: "flex-start"}}>
                <ScrollView>
                    <Input
                        defaultValue={geralInfo.titulo}
                        onChangeText={handleGeralInput("titulo")}
                        title={"Título"}
                    />
                    <Input
                        multiline
                        numberOfLines={4}
                        defaultValue={geralInfo.descricao}
                        onChangeText={handleGeralInput("descricao")}
                        title={"Descrição"}
                    />

                    <View style={{flex: 1, flexDirection: "row"}}>
                        <View style={{flex: 0.8}}>
                            <Text>Categoria</Text>
                            <View style={{height: 1}}>

                            </View>
                            <Picker
                                selectedValue={geralInfo.id_categoria}
                                onValueChange={handleGeralInput("id_categoria")}>
                                {renderCategoriaList()}
                            </Picker>
                        </View>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                            <Feather name={'plus'} size={widthPercentageToDP('6.5%')} color={'white'}/>
                        </TouchableOpacity>

                    </View>
                    <View style={{height: 2}}>

                    </View>

                    <View style={{flex: 1, flexDirection: "row"}}>
                        <View style={{flex: 0.8}}>
                            <Text>Tipo</Text>
                            <Picker
                                selectedValue={geralInfo.tipo}
                                onValueChange={handleGeralInput("tipo")}>
                                {renderTiposList()}
                            </Picker>
                        </View>
                    </View>


                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <Input
                            editable={false}
                            selectTextOnFocus={false}
                            title={'Data'}
                            defaultValue={formatDate(geralInfo.data)}
                        />
                    </TouchableOpacity>
                </ScrollView>
            </Card>
            <View>
                <View style={{height: 12}}>
                </View>
                <Button color={'red'} onPress={criarMeta}>
                    <Text style={{color: 'white'}}>Salvar Meta</Text>
                </Button>

                {
                    meta && (
                        <>
                            <View style={{height: 12}}>
                            </View>
                            <Button color={'orange'} onPress={concluirMetaParcialmenteHold}>
                                <Text style={{color: 'white'}}>Concluir meta parcialmente</Text>
                            </Button>
                            <View style={{height: 12}}>
                            </View>
                            <Button color={'green'} onPress={concluirMetaHold}>
                                <Text style={{color: 'white'}}>Concluir Meta</Text>
                            </Button>
                            <View style={{height: 12}}>
                            </View>
                            <Button color={'red'} onPress={excluiMeta}>
                                <Text style={{color: 'white'}}>Excluir Meta</Text>
                            </Button>
                        </>
                    )
                }

            </View>
        </View>
    );
}