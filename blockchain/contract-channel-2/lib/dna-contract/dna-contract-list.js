'use strict';

const StateList = require('../../ledger-api/statelist.js');

const DnaContract = require('./dna-contract.js');

class DnaContractList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.dnaContractList');
        this.use(DnaContract);
    }

    async addDnaContract(dnaContract) {
        return this.addState(dnaContract);
    }

    async getDnaContract(id) {
        const dnaContractKey = DnaContract.makeKey([id]);
        return this.getState(dnaContractKey);
    }

    async updateDnaContract(dnaContract) {
        return this.updateState(dnaContract);
    }

    async getAllDnaContract() {
        return this.getStateByRange()
    }
}


module.exports = DnaContractList;
