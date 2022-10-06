import db from "../model/database/SQLiteDatabase";
import Lembrete from "../model/models/Lembrete";

async function allLembretes (){
    const result = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM lembrete;`,
                [],
                //-----------------------
                (_, {rows}) => resolve(rows._array),
                (_, error) => reject(error)
            )
        })
    })

    return result.map((element) => {
        element.concluida_em = element.concluida_em ? new Date(element.concluida_em) : null
        return new Lembrete(element)
    })
}



async function createLembrete({descricao, data, concluida_em}) {
    const result = await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    INSERT INTO lembrete ( descricao, data, concluida_em ) VALUES (?,?,?);
                    `,
                [descricao, data, concluida_em],
                (_, {
                    rowsAffected,
                    insertId
                }) => rowsAffected > 0 ? resolve(insertId) : reject("Error inserting obj"),
                (_, error) => reject(error)
            )
        })
    })

    return findLembrete(result)
}

async function findLembrete(id) {
    let result = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM lembrete WHERE id=? LIMIT 1;",
                [id],
                //-----------------------
                (_, {rows}) => (rows.length > 0) ? resolve(rows._array[0]) : reject("Obj Lembrete not found: id=" + id),
                (_, error) => reject(error)
            )
        })
    })

    return new Lembrete(result)
}

async function deleteLembrete({id}) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM lembrete WHERE id=?;",
                [id],
                (_, {rowsAffected}) => resolve(rowsAffected),
                (_, error) => reject(error)
            )
        })
    })
}

async function updateLembrete({id, descricao, data, concluida_em}) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE lembrete SET descricao=?, data=?, concluida_em=? WHERE id=?;",
                [descricao, data, concluida_em, id],
                //-----------------------
                async (_, {rowsAffected}) => {
                    if (rowsAffected > 0) resolve(await findLembrete(id));
                    else reject("Error updating obj: id=" + id);
                },
                (_, error) => reject(error)
            )
        })
    })
}

export {
    allLembretes,
    createLembrete,
    findLembrete,
    deleteLembrete,
    updateLembrete
}