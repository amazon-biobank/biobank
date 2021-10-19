const { ActiveContext, ActiveContract } = require('./../active-contract')
const InternalPaymentRedeemContract = require('./../payment-redeem/internal-payment-redeem-contract.js')
const PaymentRedeemList = require('./payment-redeem-list.js');
const CryptoUtils = require('./../crypto-utils.js');
const InternalTokenContract = require('./../token/internal-token-contract.js')
const AccountContract = require('../account/account-contract.js');
const PaymentIntentionContract = require('../payment-intention/payment-intention-contract.js')
const PaymentIntentionList = require('../payment-intention/payment-intention-list.js')

class RedeemContext extends ActiveContext {
  constructor() {
      super();
      this.paymentRedeemList = new PaymentRedeemList(this);
      this.paymentIntentionList = new PaymentIntentionList(this);
  }
}

class RedeemContract extends ActiveContract {
    createContext() {
        return new RedeemContext();
    }

    async redeem(ctx, paymentCommitment, hashLink, hashLinkIndex){
      const commitment = JSON.parse(paymentCommitment)
      await verifyCommitment(ctx, commitment)
      verifyHashLink(commitment, hashLink, hashLinkIndex)
      const linksToBeRedeemed = await getLinkToBeRedeemed(ctx, commitment, hashLinkIndex)
      await redeemLinks(ctx, commitment, linksToBeRedeemed)
      return linksToBeRedeemed
  }
}

async function verifyCommitment(ctx, commitment) {
  const hash = CryptoUtils.getHash(JSON.stringify(commitment.data))
  if(hash != commitment.commitment_hash){
      throw new Error("PaymentCommitment hash invalid")
  }

  const accountContract = new AccountContract();
  const payer = await accountContract.readAccount(ctx, commitment.data.payer_address)
  const signatureCorrect = CryptoUtils.verifySignature(payer.public_key, commitment.signature, JSON.stringify(commitment.data))
  if(!signatureCorrect) {
      throw new Error("Signature is not correct")
  }
}

function verifyHashLink(commitment, hashLink, hashLinkIndex) {
  var hash = hashLink
  for( var i = 0; i < hashLinkIndex; i++ ) {
      hash = CryptoUtils.getHash(hash)
  }
  if(hash != commitment.data.hash_root){
      throw new Error("HashLink or hashLinkIndex is incorrect")
  }
}

async function getLinkToBeRedeemed(ctx, commitment, hashLinkIndex) {
    const contract = new InternalPaymentRedeemContract()
    const isNewPaymentRedeem = ! await contract.paymentRedeemExists(ctx, commitment.commitment_hash)
    var linksToBeRedeemed;

    if(isNewPaymentRedeem) {
        const paymentRedeem = {
          "id": commitment.commitment_hash,
          "commitment_hash": commitment.commitment_hash,
          "redeemed_hash_amount": hashLinkIndex
        }
        await contract.createPaymentRedeem(ctx, JSON.stringify(paymentRedeem))
        linksToBeRedeemed = hashLinkIndex
    }
    else {
        const paymentRedeem = await contract.readPaymentRedeem(ctx, commitment.commitment_hash)
        linksToBeRedeemed = hashLinkIndex - paymentRedeem.redeemed_hash_amount
        if (linksToBeRedeemed <= 0) {
            throw new Error("Hash link already redeemed")
          }
        paymentRedeem.redeemed_hash_amount = hashLinkIndex
        contract.updatePaymentRedeem(ctx, JSON.stringify(paymentRedeem))
    }
    return linksToBeRedeemed
}

async function redeemLinks(ctx, commitment, linksToBeRedeemed) {
    const paymentIntentionContract = new PaymentIntentionContract()
    const internalTokenContract = new InternalTokenContract()
    const paymentIntention = await paymentIntentionContract.readPaymentIntention(ctx, commitment.data.payment_intention_id)
    // verify paymentIntention
    options = {
      paymentIntentionId: paymentIntention.id,
      payerAddress: paymentIntention.payer_address,
      receiverAddress: commitment.data.receiver_address,
      amount: linksToBeRedeemed * 1000
    }
    
    return await internalTokenContract.redeemEscrowToken(ctx, options )
}


module.exports = RedeemContract;
