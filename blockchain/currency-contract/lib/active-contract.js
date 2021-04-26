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
    if(ctx.called_contract == undefined){
      ctx.called_contract = 'currency'

      const userAddress = CryptoUtils.getUserAddressFromContext(ctx)
      const user = await ctx.accountList.getAccount(userAddress);
      ctx.user = user

      const args = [
        "DataContract:readData", 
        "123"
      ]
      const response = await this.queryBiobankChannel(ctx, args)
      throw(new Error(JSON.stringify(response)))
    }
  } 

  async queryBiobankChannel(ctx, args){
    const response = await ctx.stub.invokeChaincode('biobank', args, 'channel1')
    const buff = Buffer.from(response.payload, 'base64')
    return buff.toString()
  }
}



module.exports = { ActiveContract, ActiveContext };
