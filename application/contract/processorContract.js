'use strict';

const { FileSystemWallet, Gateway }  = require('fabric-network');
const path = require('path');
const fs = require('fs')

class ProcessorContract {
  async connectNetwork() {
     // Create a new file system based wallet for managing identities.
     const walletPath = path.join(process.cwd(), 'fabric-details/Org1Wallet');
     const wallet = new FileSystemWallet(walletPath);
     console.log(`Wallet path: ${walletPath}`);

     // Create a new gateway for connecting to our peer node.
    this.gateway = new Gateway();
     const connectionProfile = path.resolve(__dirname, '../fabric-details', 'connection.json');
     let connectionOptions = { wallet, identity: 'org1Admin', discovery: { enabled: true, asLocalhost: true }};
     await this.gateway.connect(connectionProfile, connectionOptions);

     // Get the network (channel) our contract is deployed to.
     const network = await this.gateway.getNetwork('mychannel');

     // Get the contract from the network.
     this.contract = network.getContract('chaincode-builder');
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
