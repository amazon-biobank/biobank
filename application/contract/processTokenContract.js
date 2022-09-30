'use strict';

const SmartContract = require('./smartContract.js');

class ProcessTokenContract extends SmartContract{
  constructor(){
    super();
    this.channel = 'channel2'
    this.chaincode = 'currency'
  }

    async createProcessToken(processTokenAttributes){
        return await this.submitTransaction('ProcessTokenContract:createProcessToken', JSON.stringify(processTokenAttributes))
    }

    async redeemProcessToken(processTokenAttributes){
      return await this.submitTransaction('ProcessTokenContract:redeemProcessToken', processTokenAttributes)
  }

}

module.exports = ProcessTokenContract;
