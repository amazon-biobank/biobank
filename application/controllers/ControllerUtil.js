const { v4: uuidv4 } = require('uuid');

class ControllerUtil {
  static formatDate (date) {
    const day  = date.getDate().toString().padStart(2, '0');
    const month  = (date.getMonth()+1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
    const year  = date.getFullYear();
    return day+"/"+month+"/"+year;
  }

  static formatDataType (type) {
    if (type == "raw_data") return "Bruto"
    if (type == "processed_data") return "Processado"
  }

  static generateId(){
    return uuidv4();
  }
}

module.exports = ControllerUtil;