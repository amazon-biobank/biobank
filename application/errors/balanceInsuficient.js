'use strict';

class BalanceInsuficient extends Error{
    constructor(id){
        super("Your balance is insuficient for this transaction");
        this.name = "BalanceInsuficient";
    }
}

module.exports = BalanceInsuficient;