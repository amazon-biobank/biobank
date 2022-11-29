const { v4: uuidv4 } = require('uuid');
const magnet = require('magnet-uri');
const crypto = require('crypto')
const Dinero = require('dinero.js');

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
    if (type == "raw_data") return "Raw"
    if (type == "processed_data") return "Processed"
  }

  static formatDataStatus (status,language) {
    if(language == 0)
      if (status == "unprocessed") return "Not Processed"
      if (status == "processing") return "Processing"
      if (status == "processed") return "Processed"
    else
      if (status == "unprocessed") return "Não processado"
      if (status == "processing") return "Processando"
      if (status == "processed") return "Processado"
  }

  static formatOperationType (type) {
    if (type == "buy_raw_data") return "Buy Raw Data"
    if (type == "buy_processed_data") return "Buy Processed Data"
    if (type == "upload") return "Upload"
    if (type == "process") return "Processed"
    if (type == "request_process") return "Process Request"
  }

  static formatProcessRequestStatus (type,language) {
    if(language == 0)  
      if (type == "not_processed") return "Not Processed"
      if (type == "processed") return "Processed"
    else
      if (type == "not_processed") return "Não processado"
      if (type == "processed") return "Processado"
  }

  static formatRoyaltyPaymentType (type) {
    if (type == "no_royalties") return "No Royalties"
    if (type == "fixed_one_time_fee") return "Fixed One Time Fee "
    if (type == "proportional_one_time_fee") return "Proportional One Time Fee"
    if (type == "fixed_periodic_fee") return "Fixed Periodic Fee"
    if (type == "proportional_periodic_fee") return "Proportional Periodic Fee"
    if (type == "profit_proportional_periodic_fee") return "Profit Proportional Periodic Fee"
  }

  static formatMoney(value){
    return Dinero({ amount: value, precision: 9 }).toFormat('0.000000000')
  }

  static generateId(){
    return uuidv4();
  }

  static getHashFromMagneticLink(magnetLink){
    const hash = magnet.decode(magnetLink).infoHash
    if (hash == undefined){
      throw new TypeError('Invalid magnetic link')
    }
    return magnet.decode(magnetLink).infoHash
  }

  static getHash(payload) {
    const hash = crypto.createHash('sha256');
    const data = hash.update(payload, 'utf-8');
    return data.digest('hex') 
  }

  static parsePercentage(value) {
    return parseFloat(value)*100
  }
  static getMessageFromError(error){
    let message = (error.responses[0].response.message)
    message = message.split(":")    
    console.log(message[message.length-1])
    message = message[message.length-1]
    return message
  }

  static formatAccount(account){
    account.balance = ControllerUtil.formatMoney(account.balance)
    account.created_at = ControllerUtil.formatDate(new Date(account.created_at))
    account.tokens = account.tokens.map((token) => {
      token.value = ControllerUtil.formatMoney(token.value)
      return token
    })
    return account
  }
}

module.exports = ControllerUtil;