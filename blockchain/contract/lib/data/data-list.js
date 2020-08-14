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

    async getAllRawData() {
        return this.getStateByRange();
    }

    async getAllProcessedData() {
        return this.getStateByRange();
    }
}


module.exports = DataList;
