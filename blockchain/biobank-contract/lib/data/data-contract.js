'use strict';

const Data = require('./data.js');
const DataList = require('./data-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract');
const AssetIdExistsError = require('../erros/asset-id-exists-error.js');

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
}

function handleDataAttributes(ctx, id, type, dataAttributes) {
    const {
        title, magnet_link, process_request_id, description,  status, created_at
    } = JSON.parse(dataAttributes);
    const collector = ctx.user.address
    const owners = [ ctx.user.address ]
    let newDataAttributes = {
        type, id, title, magnet_link, description, collector, process_request_id, owners, status, created_at
    }
    if (type == 'raw_data') { delete  newDataAttributes.process_request_id };
    return newDataAttributes;
}

module.exports = DataContract;
