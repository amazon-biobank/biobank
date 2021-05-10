const { ActiveContext, ActiveContract } = require('./../active-contract')
const AccountList = require('./../account/account-list.js');
const BiocoinOperations = require('./biocoin-operations.js');
const OperationPaymentList = require('./../operation-payment/operation-payment-list.js');
const InternalOperationPaymentContract = require('./../operation-payment/internal-operation-payment-contract.js')

class AccountContext extends ActiveContext {
    constructor() {
        super();
        this.accountList = new AccountList(this);
        this.operationPaymentList = new OperationPaymentList(this)
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
        return await createPaymentReceipt(ctx, operation)
    }
}

async function createPaymentReceipt(ctx, operation){
    const internalOperationPaymentContract = new InternalOperationPaymentContract()
    const receiptAttributes = JSON.stringify({ 
        id: operation.id, status: 'paid', created_at: new Date().toDateString() 
    })
    return await internalOperationPaymentContract.createOperationPayment(ctx, receiptAttributes)
}


module.exports = BiocoinContract;
