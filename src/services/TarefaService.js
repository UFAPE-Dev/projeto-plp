import db from "../model/database/SQLiteDatabase";
import Tarefa from "../model/models/Tarefa";

async function allTarefas (){
    const result = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM tarefa;`,
                [],
                //-----------------------
                (_, {rows}) => resolve(rows._array),
                (_, error) => reject(error)
            )
        })
    })

    return result.map((element) => {
        return new Tarefa(element)
    })
}



async function createTarefa({id_categoria, titulo, descricao, data_inicio, data_fim, status, bloco, concluida_em}) {
    const result = await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    INSERT INTO tarefa ( id_categoria, titulo, descricao, data_inicio, data_fim, status, bloco, concluida_em ) VALUES (?,?,?,?,?,?,?,?);
                    `,
                [id_categoria, titulo, descricao, data_inicio, data_fim, status, bloco, concluida_em],
                (_, {
                    rowsAffected,
                    insertId
                }) => rowsAffected > 0 ? resolve(insertId) : reject("Error inserting obj"),
                (_, error) => reject(error)
            )
        })
    })

    return findTarefa(result)
}

async function findTarefa(id) {
    let result = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM tarefa WHERE id=? LIMIT 1;",
                [id],
                //-----------------------
                (_, {rows}) => (rows.length > 0) ? resolve(rows._array[0]) : reject("Obj Tarefa not found: id=" + id),
                (_, error) => reject(error)
            )
        })
    })

    return new Tarefa(result)
}

async function deleteTarefa({id}) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM tarefa WHERE id=?;",
                [id],
                (_, {rowsAffected}) => resolve(rowsAffected),
                (_, error) => reject(error)
            )
        })
    })
}

async function updateTarefa({id, id_categoria, titulo, descricao, data_inicio, data_fim, status, bloco, concluida_em}) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE tarefa SET id_categoria=?, titulo=?, descricao=?, data_inicio=?, data_fim=?, status=?, bloco=?, concluida_em=?  WHERE id=?;",
                [id_categoria, titulo, descricao, data_inicio, data_fim, status, bloco, concluida_em, id],
                //-----------------------
                async (_, {rowsAffected}) => {
                    if (rowsAffected > 0) resolve(await findTarefa(id));
                    else reject("Error updating obj: id=" + id);
                },
                (_, error) => reject(error)
            )
        })
    })
}

export {
    allTarefas,
    createTarefa,
    findTarefa,
    deleteTarefa,
    updateTarefa
}