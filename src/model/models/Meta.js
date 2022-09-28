export default class Meta {
    constructor({id, id_categoria, titulo, descricao, data, tipo, status = null, concluida_em = null}) {
        this.id = id
        this.id_categoria = id_categoria
        this.titulo = titulo
        this.descricao = descricao
        this.data = data
        this.tipo = tipo
        this.status = status
        this.concluida_em = concluida_em
    }
}
