'use strict';

const PaymentRedeem = require('./payment-redeem.js');
const PaymentRedeemList = require('./payment-redeem-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract')
const TokenContract = require('./../token/token-contract.js')
const crypto = require('crypto')
const CryptoUtils = require('./../crypto-utils.js');
const AccountContract = require('../account/account-contract.js');
const AccountList = require('../account/account-list.js');

class PaymentRedeemContext extends ActiveContext {
    constructor() {
        super();
        this.paymentRedeemList = new PaymentRedeemList(this);
        this.accountList = new AccountList(this)
    }
}


class PaymentRedeemContract extends ActiveContract {
    createContext() {
        return new PaymentRedeemContext();
    }

    async createPaymentRedeem(ctx, paymentRedeemAttributes) {
        const newAccontAttributes = handlePaymentRedeemAttributes(paymentRedeemAttributes)

        const paymentRedeem = PaymentRedeem.createInstance(newAccontAttributes);
        await ctx.paymentRedeemList.addPaymentRedeem(paymentRedeem);

        // const tokenContract = new TokenContract()
        // await tokenContract.createScrewToken(ctx, JSON.stringify(paymentRedeem))
        return paymentRedeem;
    }

    async readPaymentRedeem(ctx, id) {
        const paymentRedeem = await ctx.paymentRedeemList.getPaymentRedeem(id);
        return paymentRedeem;
    }

    async getAllPaymentRedeem(ctx) {
        return await ctx.paymentRedeemList.getAllPaymentRedeem();
    }

    async paymentRedeemExists(ctx, id){
        const paymentRedeem = await ctx.paymentRedeemList.getPaymentRedeem(id);
        return (paymentRedeem != undefined)
    }

    async redeem(ctx, paymentCommitment, hashLink, hashLinkIndex){
        const commitment = JSON.parse(paymentCommitment)
        return await verifyCommitment(ctx, commitment)

    }

    // async validate(ctx, id, paymentRedeemAttributes){
    //     if(await this.paymentRedeemExists(ctx, id)) {
    //         throw new Error("Payment Intention ID already used")
    //     }
    //     if(ctx.user == undefined) {
    //         throw new Error("user not Found")
    //     }
    //     // validate expiration date (maybe)
    //     return true
    // }
}

function handlePaymentRedeemAttributes(paymentRedeemAttributes) {
    const { commitment_hash, redeem_hash_amount } = JSON.parse(paymentRedeemAttributes);
    const newPaymentRedeemAttributes = {
        id: commitment_hash, commitment_hash, redeem_hash_amount
    }
    return newPaymentRedeemAttributes;
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



module.exports = PaymentRedeemContract;
