import db from "../model/database/SQLiteDatabase";
import Categoria from "../model/models/Categoria";

async function allCategorias (){
    const result = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM categoria;`,
                [],
                //-----------------------
                (_, {rows}) => resolve(rows._array),
                (_, error) => reject(error)
            )
        })
    })

    return result.map((element) => {
        return new Categoria(element)
    })
}



async function createCategoria({nome, cor}) {
    const result = await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    INSERT INTO categoria ( nome, cor ) VALUES (?,?);
                    `,
                [nome, cor],
                (_, {
                    rowsAffected,
                    insertId
                }) => rowsAffected > 0 ? resolve(insertId) : reject("Error inserting obj"),
                (_, error) => reject(error)
            )
        })
    })

    return findCategoria(result)
}

async function findCategoria(id) {
    let result = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM categoria WHERE id=? LIMIT 1;",
                [id],
                //-----------------------
                (_, {rows}) => (rows.length > 0) ? resolve(rows._array[0]) : reject("Obj Categoria not found: id=" + id),
                (_, error) => reject(error)
            )
        })
    })

    return new Categoria(result)
}

async function deleteCategoria({id}) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM categoria WHERE id=?;",
                [id],
                (_, {rowsAffected}) => resolve(rowsAffected),
                (_, error) => reject(error)
            )
        })
    })
}

async function updateCategoria({id, nome, cor}) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE categoria SET nome=?, cor=? WHERE id=?;",
                [nome, cor, id],
                //-----------------------
                async (_, {rowsAffected}) => {
                    if (rowsAffected > 0) resolve(await findCategoria(id));
                    else reject("Error updating obj: id=" + id);
                },
                (_, error) => reject(error)
            )
        })
    })
}

export {
    allCategorias,
    createCategoria,
    findCategoria,
    deleteCategoria,
    updateCategoria
}