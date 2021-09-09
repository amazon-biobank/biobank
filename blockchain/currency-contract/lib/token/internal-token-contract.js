const BiocoinOperations = require('./../biocoin/biocoin-operations.js');
const TokenContract = require('./token-contract.js');
const AccountContract = require('./../account/account-contract.js')


class InternalTokenContract extends TokenContract {
    async redeemEscrowToken(ctx, { paymentIntentionId, payerAddress, receiverAddress, amount }){
      const accountContract = new AccountContract()
      var payer = await accountContract.readAccount(ctx, payerAddress)
      const { userToken, index } = findUserToken(payer.tokens, paymentIntentionId)

      if (userToken == undefined) {
          throw new Error("cant find token with paymentIntentionId")
      }

      const { senderAccount } = await BiocoinOperations.transferBiocoins(ctx, payerAddress, receiverAddress, amount)
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

module.exports = InternalTokenContract;
