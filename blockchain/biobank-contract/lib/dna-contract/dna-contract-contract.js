'use strict';

const { ActiveContext, ActiveContract } = require('./../active-contract')
const { v4: uuidv4 } = require('uuid');

const DnaContractUtils = require('./dna-contract-utils.js');

const OperationContract = require('./../operation/operation-contract')
const OperationList = require('./../operation/operation-list')

const ProcessRequestContract = require('./../process-request/process-request-contract')
const ProcessRequestList = require('./../process-request/process-request-list')

const DnaContractList = require('./dna-contract-list.js');
const DnaContract = require('./dna-contract.js');

const DataContract = require('./../data/data-contract.js');
const DataList = require('./../data/data-list.js');

class DnaContractContext extends ActiveContext {
    constructor() {
        super();
        this.dataList = new DataList(this);
        this.operationList = new OperationList(this);
        this.dnaContractList = new DnaContractList(this);
        this.processRequestList = new ProcessRequestList(this);
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

        // refactor to addDnaContractInDNA
        const dataContract = new DataContract()
        await dataContract.addDnaContractInId(ctx, dnaContract.dna_id, dnaContract.id)
        return dnaContract;
    }

    async readDnaContract(ctx, id) {
        const dnaContract = await ctx.dnaContractList.getDnaContract(id);
        return dnaContract;
    }

    async getAllDnaContract(ctx) {
        return await ctx.dnaContractList.getAllDnaContract();
    }

    async endorseProcessRequestToRawData(ctx, processRequestId){
        const processRequestContract = new ProcessRequestContract()
        const dataContract = new DataContract()

        const processRequest = await processRequestContract.readProcessRequest(ctx, processRequestId)
        let rawData = await dataContract.readData(ctx, processRequest.raw_data_id)
        
        if(rawData.status == 'unprocessed'){
            rawData.status = 'processed'
            await dataContract.updateData(ctx, rawData.type, rawData.id, JSON.stringify(rawData))

            // refactor to changeStatusDNA
            let dnaContract = await this.readDnaContract(ctx, rawData.dna_contract)
            dnaContract.accepted_processed_data = {
                processed_data_id: processRequest.processed_data_id,
                process_request_id: processRequestId
            }
            await internalUpdateDnaContract(ctx, JSON.stringify(dnaContract))
        }
    }

    async executeContract(ctx, contractId, options ){
        const operationType = JSON.parse(options).type;
        const operationId = JSON.parse(options).operationId;
        if (operationType == 'buy_dna'){
            const dnaContract = await ctx.dnaContractList.getDnaContract(contractId);
            let dna = await DnaContractUtils.getData(ctx, dnaContract.dna_id)
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

async function internalUpdateDnaContract(ctx, dnaContractAttributes){
    const newDnaContractAttributes = DnaContractUtils.handleDnaContractAttributes(dnaContractAttributes)
    const dnaContract = DnaContract.createInstance(newDnaContractAttributes);
    await ctx.dnaContractList.addDnaContract(dnaContract);
    return dnaContract;
}


module.exports = DnaContractContract;
