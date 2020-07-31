'use strict';

const StateList = require('../../ledger-api/statelist.js');

const Processor = require('./processor.js');

class ProcessorList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.processorList');
        this.use(Processor);
    }

    async addProcessor(processor) {
        return this.addState(processor);
    }

    async getProcessor(processorNumber) {
        const processorKey = Processor.makeKey([processorNumber]);
        return this.getState(processorKey);
    }

    async updateProcessor(processor) {
        return this.updateState(processor);
    }
}


module.exports = ProcessorList;
