'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs')

class DataContract {
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




  // async uploadRawData(ctx, dataNumber, dataAttributes) {
  //   const newDataAttributes = handleDataAttributes( dataNumber, 'raw_data', dataAttributes )
  //   const data = Data.createInstance(newDataAttributes);
  //   await ctx.dataList.addData(data);
  //   return data;
  // }

  // async uploadProcessedData(ctx, dataNumber, dataAttributes) {
  //     const newDataAttributes = handleDataAttributes(dataNumber, 'processed_data', dataAttributes)
  //     const data = Data.createInstance(newDataAttributes);
  //     await ctx.dataList.addData(data);
  //     return data;
  // }

  async readData(type, dataNumber) {
    await this.connectNetwork();

    const result = await this.contract.evaluateTransaction('DataContract:readData', type, dataNumber);
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

  // async updateData(ctx, type, dataNumber, dataAttributes){
  //     const newDataAttributes = handleDataAttributes(dataNumber, type, dataAttributes);
  //     const data = Data.createInstance(newDataAttributes);
  //     await ctx.dataList.updateState(data);
  //     return data


  // function handleDataAttributes(dataNumber, type, dataAttributes) {
  //   const { url, processor, description, collector, owners, price, conditions } = JSON.parse(dataAttributes);
  //   let newDataAttributes = {
  //       type, dataNumber, url, description, collector, processor, owners, price, conditions
  //   }
  //   if (type == 'raw_data') { delete  newDataAttributes.processor };
  //   return newDataAttributes;
  // }
}

module.exports = DataContract;
