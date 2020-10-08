'use strict';

const SmartContract = require('./smartContract.js');

class ProcessRequestContract extends SmartContract {
  async createProcessRequest(processRequest){
    const result = await this.submitTransaction('ProcessRequestContract:createProcessRequest', processRequest.id, JSON.stringify(processRequest))
  }

  async readProcessRequest(processRequestId) {
    return await this.evaluateTransaction('ProcessRequestContract:readProcessRequest', processRequestId);
  }

  async getAllProcessRequest() {
    return await this.evaluateTransaction('ProcessRequestContract:getAllProcessRequest');
  }

  async updateProcessRequest(processRequest){
    await this.submitTransaction('ProcessRequestContract:updateProcessRequest', processRequest.id, JSON.stringify(processRequest))
  }
}

module.exports = ProcessRequestContract;
