'use strict';

const { ActiveContext, ActiveContract } = require('./../active-contract')
const { v4: uuidv4 } = require('uuid');

const DnaContract = require('./dna-contract.js');
const DnaContractList = require('./dna-contract-list.js');
const OperationContract = require('./../operation/operation-contract')
const OperationList = require('./../operation/operation-list')
const DataList = require('./../data/data-list.js');
const DnaContractUtils = require('./dna-contract-utils.js')

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
        const newDnaContractAttributes = DnaContractUtils.handleDnaContractAttributes(dnaContractAttributes)
        await DnaContractUtils.validateContractCreation(ctx, newDnaContractAttributes)
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
        const operationId = JSON.parse(options).operationId;
        if (operationType == 'buy_dna'){
            // throw new Error(contractId)
            const dnaContract = await ctx.dnaContractList.getDnaContract(contractId);
            let dna = await DnaContractUtils.getData(ctx, dnaContract.dnaId)
            const operation = DnaContractUtils.createBuyingOperation(ctx, dna, dnaContract, operationId)
            return operation
        }
        return
    }

    async executeOperation(ctx, operationId){
        const operationContract = new OperationContract()
        const operation = await operationContract.readOperation(ctx, operationId)
        const args = [ "OperationPaymentContract:readOperationPayment",  operationId ]
        const payment = await this.queryCurrencyChannel(ctx, args)
        
        DnaContractUtils.checkPaymentAndOperation(ctx, payment, operation)
        let dna = await DnaContractUtils.getData(ctx, operation.details.data_id)
        await DnaContractUtils.addOwnersInData(ctx, dna)

        return dna
    }
}


module.exports = DnaContractContract;
