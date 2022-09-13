import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import {migrate, seed} from "./src/model/migrations";
import {allTarefas} from "./src/services/TarefaService";

export default function App() {
  useEffect( () => {
    async function initTables () {
      await migrate()
      let tarefas = await allTarefas()
      if(tarefas.length === 0) {
        await seed()
      }
    }
    initTables()
  }, [])
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
