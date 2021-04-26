'use strict';

const { Context, Contract } = require('fabric-contract-api');
const CryptoUtils = require('./crypto-utils')

class ActiveContext extends Context {
  constructor() {
      super();
  }
}

class ActiveContract extends Contract {
  async beforeTransaction(ctx){
    const userAddress = CryptoUtils.getUserAddressFromContext(ctx)
    const args = [
      "AccountContract:readAccount", 
      userAddress
    ]
    ctx.user = await this.queryCurrencyChannel(ctx, args)
  } 

  async queryCurrencyChannel(ctx, args){
    const response = await ctx.stub.invokeChaincode('currency', args, 'channel2')
    const buff = Buffer.from(response.payload, 'base64')
    return JSON.parse(buff.toString())
  }
}



module.exports = { ActiveContract, ActiveContext };
