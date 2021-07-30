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
    if(this.needsQueryUser(ctx)){
      const userAddress = CryptoUtils.getUserAddressFromContext(ctx)
      ctx.user = await ctx.accountList.getAccount(userAddress);
      if(ctx.user == undefined) {
        throw new Error(ctx.user + "user account not created")
      }
    }
  } 

  async queryBiobankChannel(ctx, args){
    const response = await ctx.stub.invokeChaincode('biobank', args, 'channel1')
    const buff = Buffer.from(response.payload, 'base64')
    const responseString = buff.toString()
    if(responseString == ''){ return responseString }
    else { return JSON.parse(responseString) }
  }

  needsQueryUser(ctx){
    const calledContract = ctx.stub.getArgs()[0]
    const allowedContracts = ["AccountContract:createAccount", "PaymentIntentionContract:getBlockPrice"]
    return !allowedContracts.includes(calledContract)
  }
}



module.exports = { ActiveContract, ActiveContext };
