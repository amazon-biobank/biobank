'use strict';

const SmartContract = require('./smartContract.js');

class DnaContractContract extends SmartContract{
  async createDnaContract(processor){
    await this.submitTransaction('DnaContractContract:createDnaContract', processor.id, JSON.stringify(processor))
  }

  async readDnaContract(dnaContractID) {
    return await this.evaluateTransaction('DnaContractContract:readDnaContract', dnaContractID);
  }

  async getAllDnaContract() {
    return await this.evaluateTransaction('DnaContractContract:getAllDnaContract');
  }

  async executeContract() {
    return await this.evaluateTransaction('DnaContractContract:executeContract');
  }
}

module.exports = DnaContractContract;
