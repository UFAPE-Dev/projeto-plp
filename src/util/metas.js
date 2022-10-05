import db from "../model/database/SQLiteDatabase";

const quantidadeMetasConcluidasAno = async (firstDAte, endDate) => {
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

const quantidadeMetasAno = async (firstDAte, endDate) => {
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

const quantidadeMetasMes = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
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
}

const quantidadeMetasConcluidasMes = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
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
}

const quantidadeMetasSemanaMes = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, strftime('%W', data) AS semana, strftime('%m', data) AS mes FROM meta WHERE data BETWEEN ? AND ? GROUP BY semana, mes;
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

const quantidadeMetasConcluidasSemanaMes = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, strftime('%W', data) AS semana, strftime('%m', data) AS mes FROM meta WHERE data BETWEEN ? AND ? AND status = "Concluída" GROUP BY semana, mes;
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


const quantidadeMetasConcluidasCategoria = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, c.nome AS categoria FROM meta t, categoria c WHERE t.data BETWEEN ? AND ? AND t.status = "Concluída" AND t.id_categoria = c.id GROUP BY c.nome;
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

const quantidadeMetasConcluidasTipo = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, tipo FROM meta WHERE data BETWEEN ? AND ? AND status = "Concluída" GROUP BY tipo;
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

const quantidadeMetasConcluidasBlocos = async (firstDAte, endDate, bloco) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM meta WHERE data BETWEEN ? AND ? AND status = "Concluída" AND bloco = ?;
                    `,
                [firstDAte, endDate, bloco],
                (_, {rows}) => resolve(rows._array[0].quantidade),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });
}

export {
    quantidadeMetasConcluidasAno,
    quantidadeMetasAno,
    quantidadeMetasConcluidasCategoria,
    quantidadeMetasConcluidasBlocos,
    quantidadeMetasMes,
    quantidadeMetasConcluidasMes,
    quantidadeMetasSemanaMes,
    quantidadeMetasConcluidasSemanaMes,
    quantidadeMetasConcluidasTipo
}
