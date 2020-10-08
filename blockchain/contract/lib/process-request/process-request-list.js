'use strict';

const StateList = require('../../ledger-api/statelist.js');
const ProcessRequest = require('./process-request.js');

class ProcessRequestList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.processRequestList');
        this.use(ProcessRequest);
    }

    async addProcessRequest(processRequest) {
        return this.addState(processRequest);
    }

    async getProcessRequest(id) {
        const processRequestKey = ProcessRequest.makeKey([id]);
        return this.getState(processRequestKey);
    }

    async updateProcessRequest(processRequest) {
        return this.updateState(processRequest);
    }

    async getAllProcessRequest() {
        return this.getStateByRange()
    }
}


module.exports = ProcessRequestList;
