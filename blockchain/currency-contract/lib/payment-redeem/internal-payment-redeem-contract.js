'use strict';

const PaymentRedeem = require('./payment-redeem.js');
const PaymentRedeemContract = require('./payment-redeem-contract.js');

class InternalPaymentRedeemContract extends PaymentRedeemContract {
    async createPaymentRedeem(ctx, paymentRedeemAttributes) {
      await this.validate(ctx, JSON.parse(paymentRedeemAttributes))
      return await savePaymentRedeem(ctx, paymentRedeemAttributes);
    }

    async updatePaymentRedeem(ctx, paymentRedeemAttributes) {
        return await savePaymentRedeem(ctx, paymentRedeemAttributes);
    }

    async validate(ctx, newAttributes){
        if(await this.paymentRedeemExists(ctx, newAttributes.id)) {
            throw new Error("Payment Redeem ID already used")
        }
        return true
    }
}

async function savePaymentRedeem(ctx, paymentRedeemAttributes){
    const newAttributes = handlePaymentRedeemAttributes(paymentRedeemAttributes)
    const paymentRedeem = PaymentRedeem.createInstance(newAttributes);
    await ctx.paymentRedeemList.addPaymentRedeem(paymentRedeem);
    return paymentRedeem
}

function handlePaymentRedeemAttributes(paymentRedeemAttributes) {
    const { commitment_hash, redeemed_hash_amount } = JSON.parse(paymentRedeemAttributes);
    const newPaymentRedeemAttributes = {
        id: commitment_hash, commitment_hash, redeemed_hash_amount
    }
    return newPaymentRedeemAttributes;
}


module.exports = InternalPaymentRedeemContract;
