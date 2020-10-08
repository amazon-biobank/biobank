'use strict';

const SmartContract = require('./smartContract.js');

class OperationContract extends SmartContract{
  async createOperation(operation){
    await this.connectNetwork();

    const transaction = this.contract.createTransaction('OperationContract:createOperation')
    operation.transaction_id = transaction.getTransactionId()

    const result = await transaction.submit(operation.id, JSON.stringify(operation))

    await this.gateway.disconnect();
    return operation
  }

  async readOperation(operationId) {
    return await this.evaluateTransaction('OperationContract:readOperation', operationId);
  }
}

module.exports = OperationContract;
