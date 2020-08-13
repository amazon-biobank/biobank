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

    async uploadRawData(ctx, dataNumber, dataAttributes) {
        const newDataAttributes = handleDataAttributes( dataNumber, 'raw_data', dataAttributes )
        const data = Data.createInstance(newDataAttributes);
        await ctx.dataList.addData(data);
        return data;
    }

    async uploadProcessedData(ctx, dataNumber, dataAttributes) {
        const newDataAttributes = handleDataAttributes(dataNumber, 'processed_data', dataAttributes)
        const data = Data.createInstance(newDataAttributes);
        await ctx.dataList.addData(data);
        return data;
    }

    async readData(ctx, type, dataNumber) {
        let dataKey = Data.makeKey([type, dataNumber]);
        let data = await ctx.dataList.getData(dataKey);
        return data;
    }

    async updateData(ctx, type, dataNumber, dataAttributes){
        const newDataAttributes = handleDataAttributes(dataNumber, type, dataAttributes);
        const data = Data.createInstance(newDataAttributes);
        await ctx.dataList.updateState(data);
        return data
    }

    async getAllData(ctx) {
        const allRawData = await ctx.dataList.getAllRawData();
        const allProcessedData = await ctx.dataList.getAllProcessedData();
        return allRawData.concat(allProcessedData);
    }
}

function handleDataAttributes(dataNumber, type, dataAttributes) {
    const { title, url, processor, description, collector, owners, price, created_at, conditions } = JSON.parse(dataAttributes);
    let newDataAttributes = {
        type, dataNumber, title, url, description, collector, processor, owners, price, created_at, conditions
    }
    if (type == 'raw_data') { delete  newDataAttributes.processor };
    return newDataAttributes;
}

module.exports = DataContract;
