'use strict';

const SmartContract = require('./smartContract.js');

class DataContract extends SmartContract {
  async createRawData(data){
    await this.submitTransaction('DataContract:uploadRawData', data.id, JSON.stringify(data))
  }

  async createProcessedData(data){
    await this.submitTransaction('DataContract:uploadProcessedData', data.id, JSON.stringify(data))
  }

  async createTkData(data){ //Somente para teste, tem que alterar o contrato
    await this.submitTransaction('DataContract:uploadRawData', data.id, JSON.stringify(data))
  }

  async updateData(data){
    await this.submitTransaction('DataContract:updateData', data.type, data.id, JSON.stringify(data))
  }

  async readData(dataId) {
    return await this.evaluateTransaction('DataContract:readData', dataId);
  }

  async getAllData() {
    return await this.evaluateTransaction('DataContract:getAllData');
  }

  async getAllRawData() {
    return await this.evaluateTransaction('DataContract:getAllRawData');
  }

  async getAllOperation(dataId) {
    return await this.evaluateTransaction('OperationContract:getOperationByData', dataId);
  }

  async getDataHistory(dataId) {
    return await this.evaluateTransaction('DataContract:getDataHistory', dataId);
  }

  async addDnaContractInId(dataId, dnaContractId){
    return await this.submitTransaction('DataContract:addDnaContractInId', dataId, dnaContractId);
  }

  async addProcessRequest(dataId, processRequestId) {
    return await this.submitTransaction('DataContract:addProcessRequest', dataId, processRequestId);
  }
}

module.exports = DataContract;
