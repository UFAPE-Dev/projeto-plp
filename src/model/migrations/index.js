import db from "../database/SQLiteDatabase";
import {createCategoria} from "../../services/CategoriaService";
import {createTarefa} from "../../services/TarefaService";
import {createMeta} from "../../services/MetaService";
import {createLembrete} from "../../services/LembreteService";
import {CONCLUIDA, PARCIAL} from "../enums/Status";
import {MANHA, TARDE, NOITE, UMAHORA, MEIAHORA} from "../enums/Bloco";
import {DIARIA, SEMANAL, MENSAL, ANUAL} from "../enums/Tipo";

const tables = ['categoria', 'tarefa', 'meta']

function migrate() {
    db.transaction((tx) => {
        tx.executeSql(
            `
            CREATE TABLE IF NOT EXISTS categoria (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nome TEXT NOT NULL,
              cor TEXT NOT NULL
            );
        `)
        tx.executeSql(
            `
            CREATE TABLE IF NOT EXISTS tarefa (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  titulo TEXT NOT NULL,
                  descricao TEXT,
                  data_inicio TEXT NOT NULL,
                  data_fim TEXT NOT NULL,
                  status TEXT,
                  bloco TEXT NOT NULL,
                  concluida_em TEXT,
                  id_categoria INTEGER NOT NULL,
                  FOREIGN KEY (id_categoria) REFERENCES categoria (id)
                );
            `)
        tx.executeSql(
            `
            CREATE TABLE IF NOT EXISTS meta (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              titulo TEXT NOT NULL,
              descricao TEXT,
              data TEXT NOT NULL,
              tipo TEXT NOT NULL,
              status TEXT,
              concluida_em TEXT,
              id_categoria INTEGER NOT NULL,
              FOREIGN KEY (id_categoria) REFERENCES categoria (id)
            );
        `)

        tx.executeSql(
            `
            CREATE TABLE IF NOT EXISTS lembrete (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              descricao TEXT NOT NULL,
              data TEXT NOT NULL,
              concluida_em TEXT
            );
        `)
    })
}

function dropTables() {
    tables.forEach(element => {
        db.transaction(tx => {
            tx.executeSql(`DROP TABLE ${element}`); //Deleta cada tabela
        })
    })
}


async function seed() {
    let categorias = []
    let tarefas = []
    let metas = []
    let lembretes = []

    for (let i = 0; i < 10; i++) {
        let categoria = await createCategoria({
            nome: 'Categoria ' + i,
            cor: '#' + Math.floor(Math.random() * 16777215).toString(16)
        })
        categorias.push(categoria)
        console.log(categoria)
    }
    console.log(categorias)

    for (let i = 0; i < 50; i++) {
        let start = randomDate()
        let end = randomDate(new Date(start))
        let data_concluida = randomDate(new Date(start), new Date(end))
        let tarefa = await createTarefa({
            titulo: 'Tarefa ' + i,
            descricao: 'Descrição ' + i,
            data_inicio: start,
            data_fim: end,
            status: getRandomStatus(),
            bloco: getRandomBloco(),
            concluida_em: getRandomBoolean() ? data_concluida : null,
            id_categoria: categorias[getRandomInt(0, categorias.length)].id
        })
        tarefas.push(tarefa)
        console.log(tarefa)
    }
    console.log(tarefas)

    for (let i = 0; i < 50; i++) {
        let data = randomDate()
        let data_concluida = randomDate(new Date(data))
        let meta = await createMeta({
            titulo: 'Meta ' + i,
            descricao: 'Descrição ' + i,
            data: data,
            tipo: getRandomTipo(),
            status: getRandomStatus(),
            concluida_em: getRandomBoolean() ? data_concluida : null,
            id_categoria: categorias[getRandomInt(0, categorias.length)].id
        })
        metas.push(meta)
        console.log(meta)
    }
    console.log(metas)

    for (let i = 0; i < 50; i++) {
        let lembrete = await createLembrete({
            descricao: 'Lembrete ' + i,
            data: randomDate(),
            concluida_em: randomDate()
        })
        lembretes.push(lembrete)
        console.log(lembrete)
    }
    console.log(lembretes)

    console.log("SEEDED!")
    console.log("Criados: " + categorias.length + " categorias")
    console.log("Criados: " + tarefas.length + " tarefas")
    console.log("Criados: " + metas.length + " metas")
    console.log("Criados: " + lembretes.length + " lembretes")

}

function randomDate(start = new Date(2022, 0, 1), end = new Date(2023, 11, 1)) {
    let random_date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return random_date.toISOString()
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomStatus() {
    let status = getRandomInt(1, 4)
    switch (status) {
        case 1:
            status = CONCLUIDA
            break
        case 2:
            status = PARCIAL
            break
        case 3:
            status = null
            break
    }
    return status
}

function getRandomTipo() {
    let tipo = getRandomInt(1, 5)
    switch (tipo) {
        case 1:
            tipo = DIARIA
            break
        case 2:
            tipo = SEMANAL
            break
        case 3:
            tipo = MENSAL
            break
        case 4:
            tipo = ANUAL
            break
    }
    return tipo
}

function getRandomBloco() {
    let bloco = getRandomInt(1, 6)
    switch (bloco) {
        case 1:
            bloco = MANHA
            break
        case 2:
            bloco = TARDE
            break
        case 3:
            bloco = UMAHORA
            break
        case 4:
            bloco = MEIAHORA
            break
        case 5:
            bloco = NOITE
            break
    }
    return bloco
}

//create a function to get a random boolean
function getRandomBoolean() {
    return Math.random() >= 0.5;
}

export {
    migrate,
    dropTables,
    seed
}
