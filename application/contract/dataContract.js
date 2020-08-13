'use strict';

const { FileSystemWallet, Gateway }  = require('fabric-network');
const path = require('path');
const fs = require('fs')

class DataContract {
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
