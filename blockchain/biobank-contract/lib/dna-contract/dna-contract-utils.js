'use strict';

const CryptoUtils = require('./../crypto-utils')
const InternalOperationContract = require('./../operation/internal-operation-contract')
const Data = require('../data/data.js');

class DnaContractUtils {
  static handleDnaContractAttributes(dnaContractAttributes) {
    const { dnaId, parameters, created_at } = JSON.parse(dnaContractAttributes);
    const { price } = parameters
    const filteredParameters = { price }
    const id = CryptoUtils.getHash(dnaId)

    const newDnaContractAttributes = {
        id, dnaId, parameters: filteredParameters, created_at
    }
    return newDnaContractAttributes;
  }

  static async validateContractCreation(ctx, dnaContractAttributes){
    const dna = await this.getData(ctx, dnaContractAttributes.dnaId)
    // only collector can create contract
    if(dna.collector == undefined || ctx.user.address != dna.collector ){
        throw new Error('Unauthorized')
    }
    return true
  }

  static async addOwnersInData(ctx, dna){
    if(dna.owners.includes(ctx.user.address) == false) {
        dna.owners.push(ctx.user.address)
        await ctx.dataList.updateState(dna);
    }
    return dna
  }

  static async getData(ctx, dataId){
    const dataKey = Data.makeKey([dataId]);
    const data = await ctx.dataList.getData(dataKey); 
    return data
  }

  static checkPaymentAndOperation(ctx, payment, operation){
    if(payment == undefined || payment.status != "paid"){
        throw new Error("Operation not paid")
    }
    if (operation.userAddress != ctx.user.address){
        throw new Error("user not allowed")
    }
    return true
  }

  static async createBuyingOperation(ctx, dna, dnaContract, operationId){
    const internalOperationContract = new InternalOperationContract()
    const operationAttributes = JSON.stringify({
        type: 'buy',
        userAddress: ctx.user.address,
        created_at: new Date().toDateString(),
        details: {
            data_id: dna.id,
            contractId: dnaContract.id
        },
        input: [{
            address: ctx.user.address,
            value: dnaContract.parameters.price
        }],
        output: [{
            address: dna.collector,
            value: dnaContract.parameters.price
        }]
    })
    return await internalOperationContract.createOperation(ctx, operationId, operationAttributes)
  }
}

module.exports = DnaContractUtils;
