'use strict';

const ConnectService = require('./../services/connectService.js');


class OperationContract {
  async connectNetwork() {
    const { network, gateway, contract } = await new ConnectService().connectNetwork()
    this.network = network;
    this.gateway = gateway;
    this.contract = contract
  }

  async createOperation(operation){
    await this.connectNetwork();

    const transaction = this.contract.createTransaction('OperationContract:createOperation')
    operation.transaction_id = transaction.getTransactionId()

    const result = await transaction.submit(operation.id, JSON.stringify(operation))

    await this.gateway.disconnect();
    return operation
  }

  async readOperation(operationId) {
    await this.connectNetwork();

    const result = await this.contract.evaluateTransaction(
      'OperationContract:readOperation',
      operationId
    );

    await this.gateway.disconnect();
    return JSON.parse(result.toString());
  }
}

module.exports = OperationContract;
