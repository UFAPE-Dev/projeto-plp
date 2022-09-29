import db from "../model/database/SQLiteDatabase";

const quantidade_metas_concluidas_banco = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM meta WHERE status = "Concluída";
                    `,
                [firstDAte, endDate],
                (_, {rows}) => resolve(rows._array[0].quantidade),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });
}

const quantidade_metas_totais_banco = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM meta;
                    `,
                [firstDAte, endDate],
                (_, {rows}) => resolve(rows._array[0].quantidade),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });
}

const quantidade_metas_concluidas = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM meta WHERE data BETWEEN ? AND ? AND status = "Concluída";
                    `,
                [firstDAte, endDate],
                (_, {rows}) => resolve(rows._array[0].quantidade),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });
}

const quantidade_metas_totais = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM meta WHERE data BETWEEN ? AND ?;
                    `,
                [firstDAte, endDate],
                (_, {rows}) => resolve(rows._array[0].quantidade),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });
}

const quantidades_mes = async (firstDAte, endDate) => {
    const result = await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, strftime('%m', data) AS mes FROM meta WHERE data BETWEEN ? AND ? GROUP BY mes;
                    `,
                [firstDAte, endDate],
                (_, {rows}) => resolve(rows._array),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });

    return result
}

const quantidades_mes_concluida = async (firstDAte, endDate) => {
    const result = await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, strftime('%m', data) AS mes FROM meta WHERE data BETWEEN ? AND ? AND status = "Concluída" GROUP BY mes;
                    `,
                [firstDAte, endDate],
                (_, {rows}) => resolve(rows._array),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });

    return result
}

const quantidades_semana = async (firstDAte, endDate) => {
    const result = await new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, strftime('%W', data) AS semana FROM meta WHERE data BETWEEN ? AND ? GROUP BY semana;
                    `,
                [firstDAte, endDate],
                (_, {rows}) => resolve(rows._array),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });

    return result
}

const quantidades_semana_concluida = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, strftime('%W', data) AS semana FROM meta WHERE data BETWEEN ? AND ? AND status = "Concluída" GROUP BY semana;
                    `,
                [firstDAte, endDate],
                (_, {rows}) => resolve(rows._array),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });
}

const quantidade_metas_concluidas_categoria = async (firstDAte, endDate, id_categoria) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM meta WHERE data BETWEEN ? AND ? AND status = "Concluída" AND id_categoria = ?;
                    `,
                [firstDAte, endDate, id_categoria],
                (_, {rows}) => resolve(rows._array[0].quantidade),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });
}

const quantidade_metas_totais_categoria = async (firstDAte, endDate, id_categoria) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM meta WHERE data BETWEEN ? AND ? AND id_categoria = ?;
                    `,
                [firstDAte, endDate, id_categoria],
                (_, {rows}) => resolve(rows._array[0].quantidade),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });
}




export {
    quantidade_metas_concluidas,
    quantidade_metas_totais,
    quantidades_mes,
    quantidades_mes_concluida
}
