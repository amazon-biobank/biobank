const BiocoinOperations = require('../biocoin/biocoin-operations.js');
const EscrowTokenContract = require('./escrow-token-contract.js');
const AccountContract = require('../account/account-contract.js')


class InternalEscrowTokenContract extends EscrowTokenContract {
    async redeemEscrowToken(ctx, { paymentIntentionId, payerAddress, receiverAddress, amount }){
      const accountContract = new AccountContract()
      var payer = await accountContract.readAccount(ctx, payerAddress)
      const receiver = await accountContract.readAccount(ctx, receiverAddress)
      const { userToken, index } = findUserToken(payer.tokens, paymentIntentionId)

      if (userToken == undefined) {
          throw new Error("cant find token with paymentIntentionId")
      }

      const { senderAccount } = await BiocoinOperations.transferBiocoins(ctx, payer, receiver, amount)
      senderAccount.tokens[index].value -= amount  
      return await ctx.accountList.updateState(senderAccount);
    }
}

function findUserToken(tokens, id){
  const isIdEqual = (element) => element.payment_intention_id == id
  const index = tokens.findIndex(isIdEqual)
  const userToken = tokens[index]
  return { userToken, index }
}

module.exports = InternalEscrowTokenContract;
