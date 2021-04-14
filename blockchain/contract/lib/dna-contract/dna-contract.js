'use strict';

const State = require('../../ledger-api/state.js');


class DnaContract extends State {
    constructor(obj) {
        super(DnaContract.getClass(), [obj.id]);
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


    static fromBuffer(buffer) {
        return DnaContract.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state DnaContract to commercial paper
     * @param {Buffer} DnaContract to form back into the object
     */
    static deserialize(dnaContract) {
        return State.deserializeClass(dnaContract, DnaContract);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(dnaContractAttributes) {
      return new DnaContract(dnaContractAttributes);
    }

    static getClass() {
        return 'org.dnaContract';
    }
}

module.exports = DnaContract;
