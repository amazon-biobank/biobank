'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs')

class ProcessorContract {
  async connectNetwork() {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'fabric-details/wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const connectionProfilePath = path.resolve(__dirname, '..', '..',  'blockchain', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    let connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));

    // Create a new gateway for connecting to our peer node.
    this.gateway = new Gateway();
    let connectionOptions = { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true }};
    await this.gateway.connect(connectionProfile, connectionOptions);

    // Get the network (channel) our contract is deployed to.
    const network = await this.gateway.getNetwork('mychannel');

    // Get the contract from the network.
    this.contract = network.getContract('biobank');
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
