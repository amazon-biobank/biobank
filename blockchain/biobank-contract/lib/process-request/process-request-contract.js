'use strict';

const ProcessRequest = require('./process-request.js');
const ProcessRequestList = require('./process-request-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract')
const DataContract = require('./../data/data-contract')
const DataList = require('./../data/data-list');
const DnaContractList = require('./../dna-contract/dna-contract-list')
const DnaContractContract = require('./../dna-contract/dna-contract-contract')
const DoesntOnwRawDNAError = require('../erros/doesnt-own-rawdna-error');


class ProcessRequestContext extends ActiveContext {
    constructor() {
        super();
        this.processRequestList = new ProcessRequestList(this);
        this.dataList = new DataList(this)
        this.dnaContractList = new DnaContractList(this)
        
    }
}

class ProcessRequestContract extends ActiveContract {
    createContext() {
        return new ProcessRequestContext();
    }

    async createProcessRequest(ctx, id, processRequestAttributes) {
        const newProcessRequestAttributes = handleProcessRequestAttributes(ctx, id, processRequestAttributes)
        const rawDNA = await validateRawDNAOwner(ctx, newProcessRequestAttributes)
        const dnaContractId  = rawDNA.dna_contract
        const rawDNAPrice = await getRawDNAPrice(ctx, dnaContractId)
        //createToken
        const ProcessTokenAttributes = handleProcessTokenAttributes(ctx, rawDNAPrice, newProcessRequestAttributes.id, rawDNA.id)
        const args = [ "ProcessTokenContract:createProcessToken",  ProcessTokenAttributes ]
        const token = await this.queryCurrencyChannel(ctx, args)
        // create process request
        const processRequest = ProcessRequest.createInstance(newProcessRequestAttributes);
        await ctx.processRequestList.addProcessRequest(processRequest);
        return processRequest;
    }

    async readProcessRequest(ctx, id) {
        const processRequest = await ctx.processRequestList.getProcessRequest(id);
        return processRequest;
    }

    async getAllProcessRequest(ctx) {
        return await ctx.processRequestList.getAllProcessRequest();
    }

    async updateProcessRequest(ctx, ProcessRequestId, ProcessRequestAttributes){
        const newProcessRequestAttributes = handleProcessRequestAttributes(ctx, ProcessRequestId, ProcessRequestAttributes);
        const processRequest = ProcessRequest.createInstance(newProcessRequestAttributes);
        await ctx.processRequestList.updateState(processRequest);
        return processRequest
    }

  
}

async function  validateRawDNAOwner(ctx, newProcessRequestAttributes){
    const dataContract = new DataContract()
    const rawDNA = await dataContract.readData(ctx, newProcessRequestAttributes.raw_data_id)
    const user = newProcessRequestAttributes.processor_id
    const owners = rawDNA.owners
    if(!owners.includes(user)){
        throw new DoesntOnwRawDNAError(rawDNA.id)
    }
    
    return rawDNA
}

async function getRawDNAPrice(ctx, dnaContradId){
    const dnaContractContract = new DnaContractContract()
    const rawDNAContract = await dnaContractContract.readDnaContract(ctx, dnaContradId)
    return rawDNAContract.raw_data_price
}

function handleProcessRequestAttributes(ctx, id, processRequestAttributes) {
    const { raw_data_id, processed_data_id, status, created_at } = JSON.parse(processRequestAttributes);
    const processor_id = ctx.user.id
    const newOperationAttributes = {
        id, raw_data_id, processor_id, processed_data_id, status, created_at
    }
    return newOperationAttributes;
}

function handleProcessTokenAttributes(ctx, value, process_request_id, raw_dna_id){
    const owner = ctx.user.id
    const token_id = process_request_id
    const ProcessTokenAttributes = {process_request_id, token_id, value,  owner, raw_dna_id}

    return ProcessTokenAttributes
}





module.exports = ProcessRequestContract;
