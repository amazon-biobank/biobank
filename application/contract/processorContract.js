'use strict';

const SmartContract = require('./smartContract.js');

class ProcessorContract extends SmartContract{
  async createProcessor(processor){
    await this.submitTransaction('ProcessorContract:createProcessor', processor.id, JSON.stringify(processor))
  }

  async readProcessor(processorId) {
    return await this.evaluateTransaction('ProcessorContract:readProcessor', processorId);
  }

  async getAllProcessor() {
    return await this.evaluateTransaction('ProcessorContract:getAllProcessor');
  }
}

module.exports = ProcessorContract;
