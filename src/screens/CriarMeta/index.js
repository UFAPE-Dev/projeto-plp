import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Card from "../../components/Card";
import Input from "../../components/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import {ANUAL, MENSAL, SEMANAL} from "../../model/enums/Tipo";
import {allCategorias} from "../../services/CategoriaService";
import {formatDate} from "../../util/dateFormat";
import Meta from "../../model/models/Meta";
import {createMeta} from "../../services/MetaService";
import exibirToast from "../../util/toastAndroid";
import Button from "../../components/Button";
import {useNavigation} from "@react-navigation/native";

export default function CriarMeta() {
    const [geralInfo, setGeralInfo] = useState({data: new Date(), id_categoria: 1});
    const [showPicker, setShowPicker] = useState(false)
    const [categorias, setCategorias] = useState([])
    const navigate = useNavigation().navigate

    useEffect(() => {
        async function initData() {
            let categorias = await allCategorias()
            console.log(categorias)
            setCategorias(categorias)
        }

        initData()
    }, [])

    function validations() {
        return geralInfo.id_categoria && geralInfo.data && geralInfo.tipo && geralInfo.titulo && geralInfo.descricao
    }

    function handleGeralInput(name) {
        return (value) => {
            setGeralInfo((oldGeralInfo) => ({...oldGeralInfo, [name]: value}));
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
            return <Picker.Item key={item.id} label={item.nome} value={item.id} />
        })
    }

    const renderTiposList = () => {
        let a = [SEMANAL, MENSAL, ANUAL]
        return a.map((item) => {
            return <Picker.Item key={item} label={item} value={item} />
        })
    }

    async function criarMeta() {

        if (validations()) {
            let meta = new Meta(geralInfo)
            meta.data = meta.data.toISOString()
            meta = await createMeta(meta)
            exibirToast('Meta criada com sucesso!')
            navigate('Metas')
        }else{
            exibirToast("Preencha todos os campos")
        }
    }

    return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, padding: '3%', width: '100%', maxHeight: "65%"}}>
            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={geralInfo.data}
                    mode={'date'}
                    onChange={(event, date) => onChange(event, date, null)}
                />
            )}
            <Card
                title={"Criar nova meta"}
                contentStyle={{padding: '3%', justifyContent: "flex-start"}}>
                <ScrollView>
                    <Input
                        defaultValue={geralInfo.titulo}
                        onChangeText ={handleGeralInput("titulo")}
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
                        <View style={{flex: 1}}>
                            <Text>Categoria</Text>
                            <Picker
                                selectedValue={geralInfo.id_categoria}
                                onValueChange={handleGeralInput("id_categoria")}>
                                {renderCategoriaList()}
                            </Picker>
                        </View>
                    </View>

                    <View style={{flex: 1, flexDirection: "row"}}>
                        <View style={{flex: 1}}>
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
                <Button color={'red'} onPress={criarMeta}>
                    <Text style={{color: 'white'}}>Criar Meta</Text>
                </Button>
            </View>
        </View>
    );
}