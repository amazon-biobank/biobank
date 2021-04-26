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

    async transferOperationBiocoins(ctx, operationId, options){
        // const args = [
        //     "OperationContract:readOperation", 
        //     operationId
        // ]
        const args = [
            "AccountContract:readAccount", 
            '219f5be1cfd00b20dbbffe7521014de36f3f298c152d4178be91c1d35b54040d'
          ]
        
        const operation = await this.queryBiobankChannel(ctx, args)
        return operation
    }
}



module.exports = BiocoinContract;
