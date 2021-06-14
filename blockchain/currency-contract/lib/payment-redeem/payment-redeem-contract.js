'use strict';

const PaymentRedeemList = require('./payment-redeem-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract')

class PaymentRedeemContext extends ActiveContext {
    constructor() {
        super();
        this.paymentRedeemList = new PaymentRedeemList(this);
    }
}


class PaymentRedeemContract extends ActiveContract {
    createContext() {
        return new PaymentRedeemContext();
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
}





module.exports = PaymentRedeemContract;
