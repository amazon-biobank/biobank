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
        const treatedResults = [];
        let allResults = await this.ctx.stub.getStateByRange("", "")

        let response = await allResults.next();
        while(response.value)  {
            let record;
            const data = response.value.value.toString('utf8');
            try {
                record = State.deserialize(data, this.supportedClasses);
                treatedResults.push(record);
            } catch (err) {
                console.log(err);
                record = data;
            }
            response = await allResults.next();
        }
        return treatedResults;
    }

    /** Stores the class for future deserialization */
    use(stateClass) {
        this.supportedClasses[stateClass.getClass()] = stateClass;
    }

}

module.exports = StateList;
