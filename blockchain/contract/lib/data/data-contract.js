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

    async getAllData(ctx, startKey, endKey) {
        // let dataKey = Data.makeKey([type, dataNumber]);
        const datas = await ctx.dataList.getAllStates(startKey, endKey);
        return datas;
    }
}

function handleDataAttributes(dataNumber, type, dataAttributes) {
    const { url, processor, description, collector, owners, price, conditions } = JSON.parse(dataAttributes);
    let newDataAttributes = { 
        type, dataNumber, url, description, collector, processor, owners, price, conditions
    }
    if (type == 'raw_data') { delete  newDataAttributes.processor };
    return newDataAttributes;
}

module.exports = DataContract;
