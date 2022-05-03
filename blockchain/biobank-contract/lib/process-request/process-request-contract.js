'use strict';

const ProcessRequest = require('./process-request.js');
const ProcessRequestList = require('./process-request-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract')
const DoesntOnwRawDNA = require('../erros/doesnt-own-rawdna-error')
const DataContract = require('./../data/data-contract')
const DataList = require('./../data/data-list');
const DoesntOnwRawDNAError = require('../erros/doesnt-own-rawdna-error');


class ProcessRequestContext extends ActiveContext {
    constructor() {
        super();
        this.processRequestList = new ProcessRequestList(this);
        this.dataList = new DataList(this)
        
    }
}

class ProcessRequestContract extends ActiveContract {
    createContext() {
        return new ProcessRequestContext();
    }

    async createProcessRequest(ctx, id, processRequestAttributes) {
        const newProcessRequestAttributes = handleProcessRequestAttributes(ctx, id, processRequestAttributes)
        const rawDNA = await validateRawDNAOwner(ctx, newProcessRequestAttributes)
        // throw new DoesntOnwRawDNAError(pirulito)
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
        throw new DoesntOnwRawDNA(rawDNA.id)
    }
    
    return rawDNA
}

function handleProcessRequestAttributes(ctx, id, processRequestAttributes) {
    const { raw_data_id, processed_data_id, status, created_at } = JSON.parse(processRequestAttributes);
    const processor_id = ctx.user.id
    const newOperationAttributes = {
        id, raw_data_id, processor_id, processed_data_id, status, created_at
    }
    return newOperationAttributes;
}





module.exports = ProcessRequestContract;
