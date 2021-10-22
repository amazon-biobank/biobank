'use strict';

const Data = require('./data.js');
const DataList = require('./data-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract');
const AssetIdExistsError = require('../erros/asset-id-exists-error.js');
const _ = require('lodash');


class DataContext extends ActiveContext {
    constructor() {
        super();
        this.dataList = new DataList(this);
    }
}


class DataContract extends ActiveContract {
    createContext() {
        return new DataContext();
    }

    async uploadRawData(ctx, dataId, dataAttributes) {
        if ( await this.dataExists(ctx,dataId)){
            throw new AssetIdExistsError(dataId);
        }
        const newDataAttributes = handleDataAttributes(ctx,  dataId, 'raw_data', dataAttributes )
        const data = Data.createInstance(newDataAttributes);
        await ctx.dataList.addData(data);
        return data;
    }

    async uploadProcessedData(ctx, dataId, dataAttributes) {
        if ( await this.dataExists(ctx,dataId)){
            throw new AssetIdExistsError(dataId);
        }
        const newDataAttributes = handleDataAttributes(ctx, dataId, 'processed_data', dataAttributes)
        const data = Data.createInstance(newDataAttributes);
        await ctx.dataList.addData(data);
        return data;
    }

    async updateData(ctx, type, dataId, dataAttributes){
        const newDataAttributes = handleDataAttributes(ctx, dataId, type, dataAttributes);
        const data = Data.createInstance(newDataAttributes);
        await ctx.dataList.updateState(data);
        return data
    }

    async addDnaContractInId(ctx, dataId, dnaContractId){
        let dataKey = Data.makeKey([dataId]);
        let data = await ctx.dataList.getData(dataKey);

        data.dna_contract = dnaContractId
        await ctx.dataList.updateState(data);
        return data
    }

    async readData(ctx, dataId) {
        let dataKey = Data.makeKey([dataId]);
        let data = await ctx.dataList.getData(dataKey);
        return data;
    }

    async getAllData(ctx) {
        const allRawData = await ctx.dataList.getDataByType('raw_data');
        const allProcessedData = await ctx.dataList.getDataByType('processed_data');
        return allRawData.concat(allProcessedData);
    }

    async getAllRawData(ctx) {
        const allRawData = await ctx.dataList.getDataByType('raw_data');
        return allRawData
    }

    async getDataHistory(ctx, dataId) {
        let dataKey = Data.makeKey([dataId]);
        const history = await ctx.dataList.getDataHistory(dataKey);
        return history
    }

    async dataExists (ctx, dataId){
        let asset = await ctx.dataList.getData(dataId);
        return asset != undefined;
    }

    async addProcessRequest(ctx, dataId, processRequestId){
        let dataKey = Data.makeKey([dataId]);
        let data = await ctx.dataList.getData(dataKey);

        if(! data.processed_requests.includes(processRequestId)){
            data.processed_requests.push(processRequestId)
        }
        await ctx.dataList.updateState(data);
        return data
    }
}

function handleDataAttributes(ctx, id, type, dataAttributes) {
    const parsedAttributes = JSON.parse(dataAttributes)
    let newAttributes = _.pick( 
        parsedAttributes, 
        [ 
          'status', 
          'created_at', 
          'metadata.title', 
          'metadata.magnet_link', 
          'metadata.description'
        ])
    
    newAttributes.owners = [ctx.user.address]
    newAttributes.type = type
    newAttributes.id = id
    newAttributes.uploader = ctx.user.address
    if(newAttributes.type == 'raw_data'){
        newAttributes.collector = ctx.user.address
        newAttributes.processed_requests = []
    } 
    else if(newAttributes.type == 'processed_data') {
        newAttributes.dna_contract = parsedAttributes.dna_contract
        newAttributes.processed_request_id = parsedAttributes.processed_request_id
    }
    return newAttributes;
}

module.exports = DataContract;
