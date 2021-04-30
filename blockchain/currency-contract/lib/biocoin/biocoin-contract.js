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

    async transferOperationBiocoins(ctx, operationId){
        const args = [
            "OperationContract:readOperation", 
            operationId
        ]
        const operation = await this.queryBiobankChannel(ctx, args)
        await this.transferBiocoins(ctx, operation["input"][0].address, operation["output"][0].address, operation["output"][0].value)
        // TODO: SUPPORT MULTIPLE INPUT/OUTPUT OPERATIONS - VALIDATION INPUT.VALUE == OUTPUT.VALUE
        return operation

    }
}



module.exports = BiocoinContract;
