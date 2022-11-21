'use strict';

const SmartContract = require('./smartContract.js');

class BiocoinContract extends SmartContract{
  constructor(){
    super();
    this.channel = 'mychannel'
    this.chaincode = 'currency'
  }

  async transferBiocoins(senderAddress, receiverAddress, amount){
    return await this.submitTransaction('BiocoinContract:transferBiocoins', senderAddress, receiverAddress, amount);
  }

  async transferOperationBiocoins(operationId) {
    return await this.submitTransaction('BiocoinContract:transferOperationBiocoins', operationId);
  }
}

module.exports = BiocoinContract;
