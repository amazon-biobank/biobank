'use strict';

const { ActiveContext, ActiveContract } = require('./../active-contract')
const CryptoUtils = require('./../crypto-utils')
const { v4: uuidv4 } = require('uuid');

const DnaContract = require('./dna-contract.js');
const DnaContractList = require('./dna-contract-list.js');
const OperationContract = require('./../operation/operation-contract')
const OperationList = require('./../operation/operation-list')
const DataList = require('./../data/data-list.js');
const Data = require('../data/data.js');
const Operation = require('../operation/operation');


class DnaContractContext extends ActiveContext {
    constructor() {
        super();
        this.dataList = new DataList(this);
        this.operationList = new OperationList(this);
        this.dnaContractList = new DnaContractList(this);
    }
}

class DnaContractContract extends ActiveContract {
    createContext() {
        return new DnaContractContext();
    }

    async createDnaContract(ctx, dnaContractAttributes) {
        const newDnaContractAttributes = handleDnaContractAttributes(dnaContractAttributes)
        await validateContractCreation(ctx, newDnaContractAttributes)
        const dnaContract = DnaContract.createInstance(newDnaContractAttributes);
        await ctx.dnaContractList.addDnaContract(dnaContract);
        return dnaContract;
    }

    async readDnaContract(ctx, id) {
        const dnaContract = await ctx.dnaContractList.getDnaContract(id);
        return dnaContract;
    }

    async getAllDnaContract(ctx) {
        return await ctx.dnaContractList.getAllDnaContract();
    }

    async executeContract(ctx, contractId, options ){
        const operationType = JSON.parse(options).type;

        if (operationType == 'buy_dna'){
            const dnaContract = await ctx.dnaContractList.getDnaContract(contractId);
            let dna = await getData(ctx, dnaContract.dnaId)
            // await BiocoinOperations.transferBiocoins(ctx, ctx.user.address, dna.collector, dnaContract.parameters.price)
            // dna = await addOwnersInData(ctx, dna)
            const operation = createBuyingOperation(ctx, dna, dnaContract)
            return operation
        }
        return
    }

    async executeOperation(ctx, operationId){
        const operationContract = new OperationContract()
        const operation = await operationContract.readOperation(ctx, operationId)
        const args = [ "OperationPaymentContract:readOperationPayment",  operationId ]
        const payment = await this.queryCurrencyChannel(ctx, args)
        
        checkPaymentAndOperation(ctx, payment, operation)
        let dna = await getData(ctx, operation.details.data_id)
        await addOwnersInData(ctx, dna)

        return dna
    }
}

function handleDnaContractAttributes(dnaContractAttributes) {
    const { dnaId, parameters, created_at } = JSON.parse(dnaContractAttributes);
    const { price } = parameters
    const filteredParameters = { price }
    const id = CryptoUtils.getHash(dnaId)

    const newDnaContractAttributes = {
        id, dnaId, parameters: filteredParameters, created_at
    }
    return newDnaContractAttributes;
}

async function validateContractCreation(ctx, dnaContractAttributes){
    const dna = await getData(ctx, dnaContractAttributes.dnaId)
    if(dna.collector == undefined || ctx.user.address != dna.collector ){
        throw new Error('Unauthorized')
    }
    // const dnaContractId = CryptoUtils.getHash(dna.id)
    // const existingDnaContract = await ctx.dnaContractList.getDnaContract(dnaContractId);
    // throw new Error(JSON.stringify(existingDnaContract))
    // if(existingDnaContract != undefined){
    //     throw new Error('The DNA contract already exists')
    // }
}

async function addOwnersInData(ctx, dna){
    if(dna.owners.includes(ctx.user.address) == false) {
        dna.owners.push(ctx.user.address)
        await ctx.dataList.updateState(dna);
    }
    return dna
}

async function getData(ctx, dataId){
    const dataKey = Data.makeKey([dataId]);
    const data = await ctx.dataList.getData(dataKey); 
    return data
}

function checkPaymentAndOperation(ctx, payment, operation){
    if(payment == undefined || payment.status != "paid"){
        throw new Error("Operation not paid")
    }
    if (operation.userAddress != ctx.user.address){
        throw new Error("user not allowed")
    }
    return true
}

async function createBuyingOperation(ctx, dna, dnaContract){
    const operation = new OperationContract()
    const id = uuidv4()
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
    return await operation.createOperation(ctx, id, operationAttributes)
}

module.exports = DnaContractContract;
