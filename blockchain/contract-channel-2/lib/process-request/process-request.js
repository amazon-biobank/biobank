'use strict';

const State = require('../../ledger-api/state.js');


class ProcessRequest extends State {
    constructor(obj) {
        super(ProcessRequest.getClass(), [obj.id]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */


    static fromBuffer(buffer) {
        return ProcessRequest.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state ProcessRequest to commercial paper
     * @param {Buffer} ProcessRequest to form back into the object
     */
    static deserialize(processRequest) {
        return State.deserializeClass(processRequest, ProcessRequest);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(processRequestAttributes) {
      return new ProcessRequest(processRequestAttributes);
    }

    static getClass() {
        return 'org.processRequest';
    }
}

module.exports = ProcessRequest;
