'use strict';

class BalanceInsuficient extends Error{
    constructor(id){
        super("[Error] Your balance is insuficient for this transaction");
        this.name = "BalanceInsuficientError";
    }
}

module.exports = BalanceInsuficient;