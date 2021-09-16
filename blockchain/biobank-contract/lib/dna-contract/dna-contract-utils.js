'use strict';

const CryptoUtils = require('./../crypto-utils')
const InternalOperationContract = require('./../operation/internal-operation-contract')
const Data = require('../data/data.js');
const _ = require('lodash');

class DnaContractUtils {
  static handleDnaContractAttributes(dnaContractAttributes) {
    let newDnaContractAttributes = _.pick( 
      JSON.parse(dnaContractAttributes), 
      [ 
        'dna_id', 
        'raw_data_price', 
        'payment_distribution.collector', 
        'payment_distribution.processor', 
        'payment_distribution.curator', 
        'payment_distribution.validators', 
        'royalty_payments', 
        'created_at' 
      ])
    newDnaContractAttributes.id = CryptoUtils.getHash(newDnaContractAttributes.dna_id)
    return newDnaContractAttributes;
  }

  static async validateContractCreation(ctx, dnaContractAttributes){
    const dna = await this.getData(ctx, dnaContractAttributes.dna_id)
    // only collector can create contract
    if(dna.collector == undefined || ctx.user.address != dna.collector ){
        throw new Error('Unauthorized')
    }

    // Validate payment distribution
    // validate royalty_payments
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
