'use strict';

const { Contract, Context } = require('fabric-contract-api');
const Data = require('./data.js');
const DataList = require('./data-list.js');


class DataContext extends Context {
    constructor() {
        super();
        this.dataList = new DataList(this);
    }
}


class DataContract extends Contract {
    createContext() {
        return new DataContext();
    }

    async uploadRawData(ctx, dataId, dataAttributes) {
        const newDataAttributes = handleDataAttributes( dataId, 'raw_data', dataAttributes )
        const data = Data.createInstance(newDataAttributes);
        await ctx.dataList.addData(data);
        return data;
    }

    async uploadProcessedData(ctx, dataId, dataAttributes) {
        const newDataAttributes = handleDataAttributes(dataId, 'processed_data', dataAttributes)
        const data = Data.createInstance(newDataAttributes);
        await ctx.dataList.addData(data);
        return data;
    }

    async updateData(ctx, type, dataId, dataAttributes){
        const newDataAttributes = handleDataAttributes(dataId, type, dataAttributes);
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
}

function handleDataAttributes(id, type, dataAttributes) {
    const {
        title, magnet_link, process_request_id, description, collector, owners, price, process_reward, status, created_at, conditions
    } = JSON.parse(dataAttributes);
    let newDataAttributes = {
        type, id, title, magnet_link, description, collector, process_request_id, owners, price, process_reward, status, created_at, conditions
    }
    if (type == 'raw_data') { delete  newDataAttributes.process_request_id };
    return newDataAttributes;
}

module.exports = DataContract;
