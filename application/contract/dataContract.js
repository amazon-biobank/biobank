'use strict';

const ConnectService = require('./../services/connectService.js');

class DataContract {
  async connectNetwork() {
    const { network, gateway, contract } = await new ConnectService().connectNetwork()
    this.network = network;
    this.gateway = gateway;
    this.contract = contract
  }

  async readData(dataId) {
    await this.connectNetwork();

    const result = await this.contract.evaluateTransaction('DataContract:readData', dataId);
    console.log(`Transaction has been submitted: ${result.toString()}`);

    await this.gateway.disconnect();
    return JSON.parse(result.toString());
  }

  async getAllData() {
    await this.connectNetwork();

    const result = await this.contract.evaluateTransaction('DataContract:getAllData');
    console.log(`Transaction has been submitted: ${result.toString()}`);

    await this.gateway.disconnect();
    return JSON.parse(result.toString());
  }

  async getAllOperation(dataId) {
    await this.connectNetwork();

    const result = await this.contract.evaluateTransaction('OperationContract:getOperationByData', dataId);
    console.log(`Transaction has been submitted: ${result.toString()}`);

    await this.gateway.disconnect();
    return JSON.parse(result.toString());
  }

  async getDataHistory(dataId) {
    await this.connectNetwork();

    const result = await this.contract.evaluateTransaction('DataContract:getDataHistory', dataId);
    console.log(`Transaction has been submitted: ${result.toString()}`);

    await this.gateway.disconnect();
    return JSON.parse(result.toString());
  }
}

module.exports = DataContract;
