const { v4: uuidv4 } = require('uuid');

class ControllerUtil {
  static formatDate (date) {
    const day  = date.getDate().toString().padStart(2, '0');
    const month  = (date.getMonth()+1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
    const year  = date.getFullYear();
    return day+"/"+month+"/"+year;
  }

  static formatCompleteDate (date) {
    const dateString = ControllerUtil.formatDate(date);
    const hours  = date.getHours().toString().padStart(2, '0');
    const minutes  = date.getMinutes().toString().padStart(2, '0');
    return dateString+' '+hours+':'+minutes;
  }

  static formatDataType (type) {
    if (type == "raw_data") return "Bruto"
    if (type == "processed_data") return "Processado"
  }

  static formatOperationType (type) {
    if (type == "buy") return "Compra"
    if (type == "upload") return "Upload"
    if (type == "process") return "Processamento"
    if (type == "request_process") return "Solicitação de Processamento"
  }

  static generateId(){
    return uuidv4();
  }
}

module.exports = ControllerUtil;