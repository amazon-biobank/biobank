'use strict';

const PaymentIntention = require('./payment-intention.js');
const PaymentIntentionList = require('./payment-intention-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract')
const TokenContract = require('./../token/token-contract.js')

class PaymentIntentionContext extends ActiveContext {
    constructor() {
        super();
        this.paymentIntentionList = new PaymentIntentionList(this);
    }
}


class PaymentIntentionContract extends ActiveContract {
    createContext() {
        return new PaymentIntentionContext();
    }

    async createPaymentIntention(ctx, id, paymentIntentionAttributes) {
        await this.validate(ctx, id, paymentIntentionAttributes)
        const newAccontAttributes = handlePaymentIntentionAttributes(ctx, id, paymentIntentionAttributes)

        const paymentIntention = PaymentIntention.createInstance(newAccontAttributes);
        await ctx.paymentIntentionList.addPaymentIntention(paymentIntention);

        const tokenContract = new TokenContract()
        await tokenContract.createScrewToken(ctx, JSON.stringify(paymentIntention))
        return paymentIntention;
    }

    async readPaymentIntention(ctx, id) {
        const paymentIntention = await ctx.paymentIntentionList.getPaymentIntention(id);
        return paymentIntention;
    }

    async getAllPaymentIntention(ctx) {
        return await ctx.paymentIntentionList.getAllPaymentIntention();
    }

    async paymentIntentionExists(ctx, id){
        const paymentIntention = await ctx.paymentIntentionList.getPaymentIntention(id);
        return (paymentIntention != undefined)
    }

    async validate(ctx, id, paymentIntentionAttributes){
        if(await this.paymentIntentionExists(ctx, id)) {
            throw new Error("payment Intention already exists")
        }
        if(ctx.user == undefined) {
            throw new Error("user not Found")
        }
        // validate expiration date (maybe)
        return true
    }
}

function handlePaymentIntentionAttributes(ctx, id, paymentIntentionAttributes) {
    const { magnetic_link, value_to_freeze, expiration_date, created_at } = JSON.parse(paymentIntentionAttributes);
    const payer_address = ctx.user.address
    const newPaymentIntentionAttributes = {
        id, payer_address, magnetic_link, value_to_freeze, expiration_date, created_at
    }
    return newPaymentIntentionAttributes;
}



module.exports = PaymentIntentionContract;
