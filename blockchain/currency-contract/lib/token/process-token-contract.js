const { ActiveContext, ActiveContract } = require('./../active-contract')
const BiocoinOperations = require('./../biocoin/biocoin-operations.js');
const TesteError = require('./../errors/teste-error')

class AccountContext extends ActiveContext {
    constructor() {
        super();
    }
}

class ProcessTokenContract extends ActiveContract {
    createContext() {
        return new AccountContext();
    }

    async createProcessToken(ctx, processTokenAttributes){
        const attributes = JSON.parse(processTokenAttributes)
        const processToken = createInstanceProcessToken(attributes)
        var user = await BiocoinOperations.withdraw_biocoins(ctx, ctx.user, processToken.value)
        user.tokens.push(processToken)
        await ctx.accountList.updateAccount(user)
        return user
    }

    async redeemProcessToken(ctx, paymentIntentionId){ 
    }
}

function createInstanceProcessToken(processTokenAttributes){
    return processToken = {
        process_request_id: processTokenAttributes.process_request_id,
        token_id: processTokenAttributes.token_id,
        type: "process_token",
        value: processTokenAttributes.value,
        owner: processTokenAttributes.owner, 
        raw_dna_id: processTokenAttributes.raw_dna_id
    }
}

module.exports =  ProcessTokenContract;