/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const State = require('./state.js');

class StateList {

    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = {};

    }

    async addState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    async getState(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        let data = await this.ctx.stub.getState(ledgerKey);
        if (data && data.toString('utf8')) {
            let state = State.deserialize(data, this.supportedClasses);
            return state;
        } else {
            return null;
        }
    }

    async updateState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    async getAllStates(startKey, endKey) {
        // const startKey = '';
        // const endKey = '';
        const treatedResults = [];
        let allResults = await this.ctx.stub.getStateByRange(startKey, endKey)
        for (const {key, value} of allResults) {
            const data = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = State.deserialize(data, this.supportedClasses);
            } catch (err) {
                console.log(err);
                record = data;
            }
            treatedResults.push({ Key: key, Record: record });
        }
        console.info(treatedResults);
        return treatedResults;
    }

    /** Stores the class for future deserialization */
    use(stateClass) {
        this.supportedClasses[stateClass.getClass()] = stateClass;
    }

}

module.exports = StateList;
