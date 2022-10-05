import db from "../model/database/SQLiteDatabase";

const quantidadeTarefasConcluidasAno = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM tarefa WHERE data_fim BETWEEN ? AND ? AND status = "Concluída";
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

const quantidadeTarefasAno = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM tarefa WHERE data_fim BETWEEN ? AND ?;
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

const quantidadeTarefasMes = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, strftime('%m', data_fim) AS mes FROM tarefa WHERE data_fim BETWEEN ? AND ? GROUP BY mes;
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

const quantidadeTarefasConcluidasMes = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, strftime('%m', data_fim) AS mes FROM tarefa WHERE data_fim BETWEEN ? AND ? AND status = "Concluída" GROUP BY mes;
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

const quantidadeTarefasSemanaMes = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, strftime('%W', data_fim) AS semana, strftime('%m', data_fim) AS mes FROM tarefa WHERE data_fim BETWEEN ? AND ? GROUP BY semana, mes;
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

const quantidadeTarefasConcluidasSemanaMes = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, strftime('%W', data_fim) AS semana, strftime('%m', data_fim) AS mes FROM tarefa WHERE data_fim BETWEEN ? AND ? AND status = "Concluída" GROUP BY semana, mes;
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


const quantidadeTarefasConcluidasCategoria = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade, c.nome AS categoria FROM tarefa t, categoria c WHERE t.data_fim BETWEEN ? AND ? AND t.status = "Concluída" AND t.id_categoria = c.id GROUP BY c.nome;
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

const quantidadeTarefasConcluidasBlocos = async (firstDAte, endDate, bloco) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM tarefa WHERE data_fim BETWEEN ? AND ? AND status = "Concluída" AND bloco = ?;
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
    quantidadeTarefasConcluidasAno,
    quantidadeTarefasAno,
    quantidadeTarefasConcluidasCategoria,
    quantidadeTarefasConcluidasBlocos,
    quantidadeTarefasMes,
    quantidadeTarefasConcluidasMes,
    quantidadeTarefasSemanaMes,
    quantidadeTarefasConcluidasSemanaMes
}
