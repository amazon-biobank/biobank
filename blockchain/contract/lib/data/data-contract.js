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

    async updateData(ctx, type, dataNumber, dataAttributes){
        const newDataAttributes = handleDataAttributes(dataNumber, type, dataAttributes);
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

    async getDataHistory(ctx, dataId) {
        let dataKey = Data.makeKey([dataId]);
        const history = await ctx.dataList.getDataHistory(dataKey);
        return JSON.stringify(history)
    }
}

function handleDataAttributes(id, type, dataAttributes) {
    const { title, url, processor, description, collector, owners, price, created_at, conditions } = JSON.parse(dataAttributes);
    let newDataAttributes = {
        type, id, title, url, description, collector, processor, owners, price, created_at, conditions
    }
    if (type == 'raw_data') { delete  newDataAttributes.processor };
    return newDataAttributes;
}

module.exports = DataContract;
