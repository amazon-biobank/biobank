'use strict';

const ConnectService = require('./../services/connectService.js');

class ProcessorContract {
  async connectNetwork() {
    const { network, gateway, contract } = await new ConnectService().connectNetwork()
    this.network = network;
    this.gateway = gateway;
    this.contract = contract
  }

  async createProcessor(processor){
    await this.connectNetwork();

    const result = await this.contract.submitTransaction(
      'ProcessorContract:createProcessor',
      processor.id,
      JSON.stringify(processor)
    )

    await this.gateway.disconnect();
  }

  async readProcessor(processorId) {
    await this.connectNetwork();

    const result = await this.contract.evaluateTransaction(
      'ProcessorContract:readProcessor',
      processorId
    );

    await this.gateway.disconnect();
    return JSON.parse(result.toString());
  }

  async getAllProcessor() {
    await this.connectNetwork();

    const result = await this.contract.evaluateTransaction('ProcessorContract:getAllProcessor');

    await this.gateway.disconnect();
    return JSON.parse(result.toString());
  }
}

module.exports = ProcessorContract;
