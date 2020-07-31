/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const DataContract = require('./data/data-contract');
const DataList = require('./data/data-list.js');
const ProcessorContract = require('./processor/processor-contract');

class ProcessRequestContract extends Contract {
    constructor() {
        super('org.biobank.processrequest');
    }

    async createProcessRequest(ctx, rawDataNumber, processorNumber) {
        initializeDataContract(ctx);
        const rawData = await ctx.dataContract.readData(ctx, "raw_data", rawDataNumber);

        const processRequest = { processorNumber , status: "not_processed" };
        rawData.addProcessRequest(processRequest);
        await ctx.dataList.updateState(rawData);

        return rawData
    }

    async executeProcessRequest(ctx, rawDataNumber, processRequestNumber, processedDataNumber) {
        initializeDataContract(ctx);

        const rawData = await ctx.dataContract.readData(ctx, "raw_data", rawDataNumber);
        const processRequest = rawData.getProcessRequest(processRequestNumber);

        processRequest.status = "processed";
        processRequest.processedDataNumber = processedDataNumber;

        rawData.updateProcessRequest(processRequest);
        await ctx.dataList.updateState(rawData);
        return rawData
    }    
}

function initializeDataContract(ctx){
    ctx.dataContract = new DataContract();
    ctx.dataList = new DataList(ctx);
}

module.exports = ProcessRequestContract;
