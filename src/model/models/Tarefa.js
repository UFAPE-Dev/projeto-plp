export default class Tarefa {
    constructor({id, id_categoria, titulo, descricao, data_inicio, data_fim, status = null, bloco, concluida_em = null}) {
        this.id = id
        this.id_categoria = id_categoria
        this.titulo = titulo
        this.descricao = descricao
        this.data_inicio = data_inicio
        this.data_fim = data_fim
        this.status = status
        this.bloco = bloco
        this.concluida_em = concluida_em
    }
}
