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
const InternalDataContract = require('../data/internal-data-contract');

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
        const dataContract = new DataContract()
        const dnaContract = await saveDnaContract(ctx, dnaContractAttributes)
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
        const internalDataContract = new InternalDataContract()
        const dataContract = new DataContract()

        const processRequest = await processRequestContract.readProcessRequest(ctx, processRequestId)
        const rawData = await dataContract.readData(ctx, processRequest.raw_data_id)
        
        if(rawData.status == 'unprocessed'){
            await internalDataContract.changeStatusData(ctx, processRequest.raw_data_id, 'processed')
            const dnaContract = await addAcceptedProcessedData(ctx, rawData, processRequest)
            return dnaContract
        } else {
            throw new Error("rawData already processed")
        }
    }

    async executeContract(ctx, contractId, options ){
        const operationType = JSON.parse(options).type;
        const operationId = JSON.parse(options).operationId;
        
        const dnaContract = await ctx.dnaContractList.getDnaContract(contractId);
        let dna = await DnaContractUtils.getData(ctx, dnaContract.dna_id)
        
        var price 
        if(operationType == 'buy_raw_dna'){ 
            price = dnaContract.raw_data_price 
        } else if(operationType == 'buy_processed_dna'){
            price = dnaContract.processed_data_price
        }

        const operation = DnaContractUtils.createBuyingOperation(ctx, dna, dnaContract, operationId, price)
        return operation
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

async function internalUpdateDnaContract(ctx, dnaContract){
    await ctx.dnaContractList.updateState(dnaContract);
    return dnaContract;
}

async function saveDnaContract(ctx, dnaContractAttributes){
    const newDnaContractAttributes = DnaContractUtils.handleDnaContractAttributes(dnaContractAttributes)
    await DnaContractUtils.validateContractCreation(ctx, newDnaContractAttributes)
    const dnaContract = DnaContract.createInstance(newDnaContractAttributes);
    await ctx.dnaContractList.addDnaContract(dnaContract);
    return dnaContract
}

async function addAcceptedProcessedData(ctx, rawData, processRequest) {
    let dnaContract = await ctx.dnaContractList.getDnaContract(rawData.dna_contract);
    dnaContract.accepted_processed_data = {
        processed_data_id: processRequest.processed_data_id,
        process_request_id: processRequest.id
    }
    await internalUpdateDnaContract(ctx, dnaContract)
    return dnaContract
}


module.exports = DnaContractContract;
