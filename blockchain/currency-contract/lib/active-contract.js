'use strict';

const { Context, Contract } = require('fabric-contract-api');
const CryptoUtils = require('./crypto-utils')
const AccountList = require('./account/account-list.js');

class ActiveContext extends Context {
  constructor() {
      super();
      this.accountList = new AccountList(this);
  }
}

class ActiveContract extends Contract {
  async beforeTransaction(ctx){
    const userAddress = CryptoUtils.getUserAddressFromContext(ctx)
    const user = await ctx.accountList.getAccount(userAddress);
    ctx.user = user
  } 

  async queryBiobankChannel(ctx, args){
    const userAddress = CryptoUtils.getUserAddressFromContext(ctx)
    const args2 = [
      "OperationContract:readOperation", 
      '123'
    ]
    const response = await ctx.stub.invokeChaincode('biobank', args2, 'channel1')
    const buff = Buffer.from(response.payload, 'base64')
    return JSON.parse(buff.toString())
  }
}



module.exports = { ActiveContract, ActiveContext };
