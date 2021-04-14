'use strict';

const StateList = require('../../ledger-api/statelist.js');

const Data = require('./data.js');

class DataList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.datalist');
        this.use(Data);
    }

    async addData(data) {
        return this.addState(data);
    }

    async getData(dataId) {
        return this.getState(dataId);
    }

    async updateData(data) {
        return this.updateState(data);
    }

    async getDataByType(type) {
        const response = await this.getStateByRange();
        const typeDatas = response.filter(function(data){
            return data.type == type
        })
        return typeDatas
    }

    async getDataHistory(key) {
        return this.getHistoryForKey(key)
    }
}


module.exports = DataList;
