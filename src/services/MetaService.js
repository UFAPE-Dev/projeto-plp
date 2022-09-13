import db from "../model/database/SQLiteDatabase";
import Meta from "../model/models/Meta";

async function allMetas (){
    const result = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM meta;`,
                [],
                //-----------------------
                (_, {rows}) => resolve(rows._array),
                (_, error) => reject(error)
            )
        })
    })

    return result.map((element) => {
        return new Meta(element)
    })
}



async function createMeta({id_categoria, titulo, descricao, data, tipo, status, concluida_em}) {
    const result = await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    INSERT INTO meta ( id_categoria, titulo, descricao, data, tipo, status, concluida_em ) VALUES (?,?,?,?,?,?,?);
                    `,
                [id_categoria, titulo, descricao, data, tipo, status, concluida_em],
                (_, {
                    rowsAffected,
                    insertId
                }) => rowsAffected > 0 ? resolve(insertId) : reject("Error inserting obj"),
                (_, error) => reject(error)
            )
        })
    })

    return findMeta(result)
}

async function findMeta(id) {
    let result = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM meta WHERE id=? LIMIT 1;",
                [id],
                //-----------------------
                (_, {rows}) => (rows.length > 0) ? resolve(rows._array[0]) : reject("Obj Meta not found: id=" + id),
                (_, error) => reject(error)
            )
        })
    })

    return new Meta(result)
}

async function deleteMeta({id}) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM meta WHERE id=?;",
                [id],
                (_, {rowsAffected}) => resolve(rowsAffected),
                (_, error) => reject(error)
            )
        })
    })
}

async function updateMeta({id, id_categoria, titulo, descricao, data, tipo, status, concluida_em}) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE meta SET id_categoria=?, titulo=?, descricao=?, data=?, tipo=?, status=?, concluida_em=?  WHERE id=?;",
                [id_categoria, titulo, descricao, data, tipo, status, concluida_em, id],
                //-----------------------
                async (_, {rowsAffected}) => {
                    if (rowsAffected > 0) resolve(await findMeta(id));
                    else reject("Error updating obj: id=" + id);
                },
                (_, error) => reject(error)
            )
        })
    })
}

export {
    allMetas,
    createMeta,
    findMeta,
    deleteMeta,
    updateMeta
}