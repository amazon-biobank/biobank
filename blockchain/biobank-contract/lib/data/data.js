'use strict';

const State = require('../../ledger-api/state.js');

class Data extends State {
    constructor(obj) {
        super(Data.getClass(), [obj.id]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getOwners() {
        return this.owners;
    }

    setOwners(newOwners) {
        this.owners = newOwners;
    }

    getProcessRequests() {
        return this.processRequests;
    }

    setProcessRequests(processRequests) {
      this.processRequests = processRequests;
    }

    getProcessRequest(processRequestNumber) {
        return this.processRequests.find(obj => {
            return obj.processRequestNumber == processRequestNumber;
          })
    }

    addProcessRequest(processRequest) {
        if (!this.processRequests) { this.processRequests = []; }
        const processRequestNumber = this.processRequests.length + 1;
        this.processRequests.push({ ...processRequest, processRequestNumber});
    }

    updateProcessRequest(newProcessRequest) {
        const length = this.processRequests.length;
        for (let i=0; i < length; i++){
            if (this.processRequests[i].processRequestNumber == newProcessRequest.processRequestNumber){
                this.processRequests[i] = newProcessRequest
            }
        }
    }

    static fromBuffer(buffer) {
        return Data.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Data);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(dataAttributes) {
      return new Data(dataAttributes);
    }

    static getClass() {
        return 'org.data';
    }
}

module.exports = Data;
