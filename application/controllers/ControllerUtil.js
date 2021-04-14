const { v4: uuidv4 } = require('uuid');
const magnet = require('magnet-uri');
const crypto = require('crypto')

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

  static formatDataStatus (status) {
    if (status == "unprocessed") return "Não Processado"
    if (status == "processing") return "Processando"
    if (status == "processed") return "Processado"
  }

  static formatOperationType (type) {
    if (type == "buy") return "Compra"
    if (type == "upload") return "Upload"
    if (type == "process") return "Processamento"
    if (type == "request_process") return "Solicitação de Processamento"
  }

  static formatProcessRequestStatus (type) {
    if (type == "not_processed") return "Não Processado"
    if (type == "processed") return "Processado"
  }

  static generateId(){
    return uuidv4();
  }

  static getHashFromMagneticLink(magnetLink){
    return magnet.decode(magnetLink).infoHash
  }

  static getHash(payload) {
    const hash = crypto.createHash('sha256');
    const data = hash.update(payload, 'utf-8');
    return data.digest('hex') 
  }
}

module.exports = ControllerUtil;