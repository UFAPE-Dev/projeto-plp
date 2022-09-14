import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import Feather from "react-native-vector-icons/Feather";
import {widthPercentageToDP} from "../../util/normalizador";
import {useNavigation} from "@react-navigation/native";

export default function Metas() {
    const navigate = useNavigation().navigate;
    return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <TouchableOpacity onPress={() => navigate('Nova Meta')} style={styles.addButton}>
                <Feather name={'plus'} size={widthPercentageToDP('6%')} color={'white'}/>
            </TouchableOpacity>
            <Text>Visualizar Metas</Text>
        </View>
    );
}