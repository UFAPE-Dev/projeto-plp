import React, {useState, useCallback} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {useFocusEffect} from "@react-navigation/native";
import {allLembretes, createLembrete, updateLembrete} from "../../services/LembreteService";
import exibirToast from "../../util/toastAndroid";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Lembretes() {
    const [lembretes, setLembretes] = useState([]);
    const [lembrete, setLembrete] = useState('')

    useFocusEffect(useCallback(() => {
        let isActive = true;

        async function init() {

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
                onPress={() => {
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
                onPress={() => {
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
    )
}