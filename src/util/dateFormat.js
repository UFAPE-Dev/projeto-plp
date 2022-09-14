//Formata a data que vai ser mostrada no campo de seleção da data
const formatDate = (date) => {
    if(typeof date === "string")
        date = new Date(date)
    let dia = date.getDate();
    let mes = date.getMonth() + 1;
    let ano = date.getFullYear();

    if (dia.toString().length === 1) {
        dia = '0' + dia
    }
    if (mes.toString().length === 1) {
        mes = '0' + mes
    }
    return dia + '/' + mes + '/' + ano
}

const formatDateDay = (date) => {
    let dia = date.getDate();

    if (dia <= 9) {
        return '0' + dia
    }else {
        return dia.toString()
    }
}

const formatDateMonth = (date) => {
    let month = date.getMonth() + 1
    if(month <= 9){
        return '0' + month
    }else {
        return month.toString()
    }
}
//Formata as horas e minutos que vão ser mostrados no campo de seleção de tempo
const formatTime = (date) => {
    if(typeof date === "string")
        date = new Date(date)

    let hora = date.getHours()
    let minutos = date.getMinutes()

    if (hora.toString().length === 1) {
        hora = '0' + hora
    }
    if (minutos.toString().length === 1) {
        minutos = '0' + minutos
    }
    return hora + ':' + minutos
}

export {
    formatDate,
    formatTime,
    formatDateMonth,
    formatDateDay
}