'use strict';

const State = require('../../ledger-api/state.js');


class Processor extends State {
    constructor(obj) {
        super(Processor.getClass(), [obj.id]);
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
        return Processor.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state Processor to commercial paper
     * @param {Buffer} Processor to form back into the object
     */
    static deserialize(processor) {
        return State.deserializeClass(processor, Processor);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(processorAttributes) {
      return new Processor(processorAttributes);
    }

    static getClass() {
        return 'org.processor';
    }
}

module.exports = Processor;
