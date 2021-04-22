const { ActiveContext, ActiveContract } = require('./../active-contract')
const AccountList = require('./../account/account-list.js');
const BiocoinOperations = require('./biocoin-operations.js');

class AccountContext extends ActiveContext {
    constructor() {
        super();
        this.accountList = new AccountList(this);
    }
}

class BiocoinContract extends ActiveContract {
    createContext() {
        return new AccountContext();
    }

    async transferBiocoins(ctx, senderAddress, receiverAddress, amount){
        return await BiocoinOperations.transferBiocoins(ctx, senderAddress, receiverAddress, amount)
    }
}



module.exports = BiocoinContract;
