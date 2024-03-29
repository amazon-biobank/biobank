'use strict';

const SmartContract = require('./smartContract.js');

class DnaContractContract extends SmartContract{
  async createDnaContract(dnaContract){
    await this.submitTransaction('DnaContractContract:createDnaContract', JSON.stringify(dnaContract))
  }

  async readDnaContract(dnaContractID) {
    return await this.evaluateTransaction('DnaContractContract:readDnaContract', dnaContractID);
  }

  async getAllDnaContract() {
    return await this.evaluateTransaction('DnaContractContract:getAllDnaContract');
  }

  async endorseProcessRequestToRawData(processRequestId) {
    return await this.submitTransaction('DnaContractContract:endorseProcessRequestToRawData', processRequestId);
  }

  async executeContract(dnaContractId, options) {
    return await this.submitTransaction('DnaContractContract:executeContract', dnaContractId, JSON.stringify(options));
  }

  async executeOperation(operatioinId) {
    return await this.submitTransaction('DnaContractContract:executeOperation', operatioinId);
  }
}

module.exports = DnaContractContract;
