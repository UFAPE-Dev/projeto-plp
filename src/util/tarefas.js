import db from "../model/database/SQLiteDatabase";

const quantidadesTarefasConcluidas = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM tarefa WHERE status = "Concluída";
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

const quantidadesTarefasTotais = async (firstDAte, endDate) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM tarefa;
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

const quantidadeTarefasConcluidasCategoria = async (firstDAte, endDate, categoria) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM tarefa WHERE data_fim BETWEEN ? AND ? AND status = "Concluída" AND id_categoria = ?;
                    `,
                [firstDAte, endDate, categoria],
                (_, {rows}) => resolve(rows._array[0].quantidade),
                (_, error) => {
                    reject(error)
                }
            )
        })
    });
}

const quantidadeTarefasTotaisCategoria = async (firstDAte, endDate, categoria) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM tarefa WHERE data_fim BETWEEN ? AND ? AND id_categoria = ?;
                    `,
                [firstDAte, endDate, categoria],
                (_, {rows}) => resolve(rows._array[0].quantidade),
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

const quantidadaTarefasTotaisBlocos = async (firstDAte, endDate, bloco) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `
                    SELECT COUNT(*) AS quantidade FROM tarefa WHERE data_fim BETWEEN ? AND ? AND bloco = ?;
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
    quantidadeTarefasTotaisCategoria,
    quantidadeTarefasConcluidasBlocos,
    quantidadaTarefasTotaisBlocos,
    quantidadeTarefasMes,
    quantidadeTarefasConcluidasMes,
    quantidadeTarefasSemanaMes,
    quantidadeTarefasConcluidasSemanaMes
}
