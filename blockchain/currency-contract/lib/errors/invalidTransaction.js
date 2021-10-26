'use strict';

class InvalidTransaction extends Error{
    constructor(id){
        super("[Error] This is an invalid transaction, please verify the transaction parameters/nNegative values are not allowed");
        this.name = "InvalidTransactionError";
    }
}

module.exports = InvalidTransaction;