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
        let key = state.getKey();
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    async getState(key) {
        let data = await this.ctx.stub.getState(key);
        if (data && data.toString('utf8')) {
            let state = State.deserialize(data, this.supportedClasses);
            return state;
        } else {
            return null;
        }
    }

    async updateState(state) {
        let key = state.getKey();
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    async getStateByRange() {
        const allResults = await this.ctx.stub.getStateByRange("", "")
        return await this.iterateAndFormatResults(allResults, 'state')
    }

    async getHistoryForKey(key){
        const allResults = await this.ctx.stub.getHistoryForKey(key)
        return await this.iterateAndFormatResults(allResults, 'stateHistory')
    }

    async iterateAndFormatResults(allResults, type){
        const treatedResults = [];
        let response = await allResults.next();

        while(response.value)  {
            let record;
            try {
                record = this.extractRecord(response, type)
                treatedResults.push(record);
            } catch (err) {
                console.log(err);
            }
            response = await allResults.next();
        }
        return treatedResults;
    }

    extractRecord(response, type){
        const dataString = response.value.value.toString('utf8');
        if (type == 'state')
            return State.deserialize(dataString, this.supportedClasses);
        else if (type == 'stateHistory') {
            const state = State.deserialize(dataString, this.supportedClasses);
            return {
                state,
                txId: response.value.txId,
                timestamp_in_seconds: response.value.timestamp.seconds.low
            }
        }
    }

    /** Stores the class for future deserialization */
    use(stateClass) {
        this.supportedClasses[stateClass.getClass()] = stateClass;
    }

}

module.exports = StateList;
