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
    if(this.needsQueryUser(ctx)){
      const userAddress = CryptoUtils.getUserAddressFromContext(ctx)
      const args = [
        "AccountContract:readAccount", 
        userAddress
      ]
      ctx.user = await this.queryCurrencyChannel(ctx, args)  
      if(ctx.user == undefined) {
        throw new Error(ctx.user + "user account not created")
      }
    }
  } 

  async queryCurrencyChannel(ctx, args){
    const response = await ctx.stub.invokeChaincode('currency', args, 'mychannel')
    const buff = Buffer.from(response.payload, 'base64')
    const responseString = buff.toString()
    if(responseString == ''){ return responseString }
    else { return JSON.parse(responseString) }
  }

  needsQueryUser(ctx){
    const calledContract = ctx.stub.getArgs()[0]
    const allowedContracts = ["OperationContract:readOperation", "DataContract:readData"]
    return !allowedContracts.includes(calledContract)
  }
}



module.exports = { ActiveContract, ActiveContext };
