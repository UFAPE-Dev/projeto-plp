import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {migrate, seed} from "./src/model/migrations";
import {allTarefas} from "./src/services/TarefaService";
import {
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_800ExtraBold,
    useFonts
} from '@expo-google-fonts/poppins'
import Routes from "./src/routes"

export default function App() {
    const [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_400Regular,
        Poppins_800ExtraBold
    });

    useEffect(() => {
        async function initTables() {
            await migrate()
            let tarefas = await allTarefas()
            if (tarefas.length === 0) {
                await seed()
            }
        }

        initTables()
    }, [])

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Routes/>
    );
}
