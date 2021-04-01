'use strict';

const DnaContract = require('./dna-contract.js');
const DnaContractList = require('./dna-contract-list.js');
const CryptoUtils = require('./../crypto-utils')
const { ActiveContext, ActiveContract } = require('./../active-contract')


class DnaContractContext extends ActiveContext {
    constructor() {
        super();
        this.dnaContractList = new DnaContractList(this);
    }
}

class DnaContractContract extends ActiveContract {
    createContext() {
        return new DnaContractContext();
    }

    async createDnaContract(ctx, id, dnaContractAttributes) {
        const newDnaContractAttributes = handleDnaContractAttributes(dnaContractAttributes)
        const dnaContract = DnaContract.createInstance(newDnaContractAttributes);
        await ctx.dnaContractList.addDnaContract(dnaContract);
        return dnaContract;
    }

    async readDnaContract(ctx, id) {
        const dnaContract = await ctx.dnaContractList.getDnaContract(id);
        return dnaContract;
    }

    async getAllDnaContract(ctx) {
        return await ctx.dnaContractList.getAllDnaContract();
    }
}

function handleDnaContractAttributes(dnaContractAttributes) {
    const { dnaId, parameters, created_at } = JSON.parse(dnaContractAttributes);
    const { price } = parameters
    const filteredParameters = { price }
    const id = CryptoUtils.getHash(dnaId)

    const newDnaContractAttributes = {
        id, dnaId, parameters: filteredParameters, created_at
    }
    return newDnaContractAttributes;
}

module.exports = DnaContractContract;
