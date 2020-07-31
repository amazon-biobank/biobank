'use strict';

const { Contract, Context } = require('fabric-contract-api');
const Processor = require('./processor.js');
const ProcessorList = require('./processor-list.js');


class ProcessorContext extends Context {
    constructor() {
        super();
        this.processorList = new ProcessorList(this);
    }
}

class ProcessorContract extends Contract {
    constructor() {
        super('org.biobank.processor');
    }

    createContext() {
        return new ProcessorContext();
    }
    

    async createProcessor(ctx, processorNumber, name, organization) {
        const processor = Processor.createInstance(processorNumber, name, organization);
        await ctx.processorList.addProcessor(processor);
        return processor;
    }

    async readProcessor(ctx, processorNumber) {
        const processor = await ctx.processorList.getProcessor(processorNumber);
        return processor;
    }
}

module.exports = ProcessorContract;
