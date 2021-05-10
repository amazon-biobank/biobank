'use strict';

const ConnectService = require('./../services/connectService.js');

class SmartContract {
  constructor(){
    this.channel = 'channel1'
    this.chaincode = 'biobank'
  }

  async connectNetwork() {
    const { network, gateway, contract } = await new ConnectService().connectNetwork(this.channel, this.chaincode)
    this.network = network;
    this.gateway = gateway;
    this.contract = contract
  }

  async submitTransaction(){
    await this.connectNetwork();
    const result = await this.contract.submitTransaction.apply(this.contract, arguments);
    await this.gateway.disconnect();
    console.log(result.toString())
    return JSON.parse(result.toString());
  }

  async evaluateTransaction(){
    await this.connectNetwork();
    const result = await this.contract.evaluateTransaction.apply(this.contract, arguments);
    await this.gateway.disconnect();
    console.log(result.toString())
    if (result.length != 0) return JSON.parse(result.toString());
  }
}

module.exports = SmartContract;
