'use strict';

const SmartContract = require('./smartContract.js');

class AccountContract extends SmartContract{
  constructor(){
    super();
    this.channel = 'channel2'
    this.chaincode = 'currency'
  }

  async createAccount(account){
    await this.submitTransaction('AccountContract:createAccount', account.id, JSON.stringify(account))
  }

  async readAccount(accountAddress) {
    return await this.evaluateTransaction('AccountContract:readAccount', accountAddress);
  }

  async getAllAccount() {
    return await this.evaluateTransaction('AccountContract:getAllAccount');
  }
}

module.exports = AccountContract;
