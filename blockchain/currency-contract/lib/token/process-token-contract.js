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
        const processToken = createInstanceProcessToken(ctx, processTokenAttributes)
        var user = await BiocoinOperations.withdraw_biocoins(ctx, ctx.user, processToken.value)
        user.tokens.push(processToken)
        await ctx.accountList.updateAccount(user)
        return processToken
    }

    async redeemProcessToken(ctx, processTokenAttributes){
        const attributes = JSON.parse(processTokenAttributes)
        const { userToken, index } = findUserToken(ctx.user.tokens, attributes.processRequestId)
        var user = await BiocoinOperations.deposit_biocoins(ctx, ctx.user, userToken.value)
        return await deleteUserToken(ctx, user, index)
    }
}

/************* Auxiliary functions **************/


function createInstanceProcessToken(ctx, processTokenAttributes){
    const parsedAttributes = JSON.parse(processTokenAttributes)
    return processToken = {
        process_request_id: parsedAttributes.process_request_id,
        token_id: parsedAttributes.token_id,
        type: "process_token",
        value: 10,
        owner: ctx.user.id, 
        raw_dna_id: parsedAttributes.raw_dna_id
    }
}

function findUserToken(tokens, id){
    const isIdEqual = (element) => element.process_request_id == id
    const index = tokens.findIndex(isIdEqual)
    const userToken = tokens[index]
    return { userToken, index }
}

async function deleteUserToken(ctx, user, index){
    user.tokens.splice(index, 1)
    await ctx.accountList.updateAccount(user)
    return user
}

module.exports =  ProcessTokenContract;