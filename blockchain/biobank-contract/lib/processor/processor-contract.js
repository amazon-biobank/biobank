'use strict';

const Processor = require('./processor.js');
const ProcessorList = require('./processor-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract')


class ProcessorContext extends ActiveContext {
    constructor() {
        super();
        this.processorList = new ProcessorList(this);
    }
}

class ProcessorContract extends ActiveContract {
    createContext() {
        return new ProcessorContext();
    }

    async createProcessor(ctx, id, processorAttributes) {
        const newProcessorAttributes = handleProcessorAttributes(id, processorAttributes)
        const processor = Processor.createInstance(newProcessorAttributes);
        await ctx.processorList.addProcessor(processor);
        return processor;
    }

    async readProcessor(ctx, id) {
        const processor = await ctx.processorList.getProcessor(id);
        return processor;
    }

    async getAllProcessor(ctx) {
        return await ctx.processorList.getAllProcessor();
    }
}

function handleProcessorAttributes(id, processorAttributes) {
    const { name, organization, created_at } = JSON.parse(processorAttributes);
    const newOperationAttributes = {
        id, name, organization, created_at
    }
    return newOperationAttributes;
}

module.exports = ProcessorContract;
