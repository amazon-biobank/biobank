'use strict';

const PaymentIntention = require('./payment-intention.js');
const PaymentIntentionList = require('./payment-intention-list.js');
const { ActiveContext, ActiveContract } = require('./../active-contract')
const EscrowTokenContract = require('./../token/escrow-token-contract')
const CONFIG = require('./../../config.json')

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
        const newAttributes = handlePaymentIntentionAttributes(ctx, id, paymentIntentionAttributes)

        const paymentIntention = PaymentIntention.createInstance(newAttributes);
        await ctx.paymentIntentionList.addPaymentIntention(paymentIntention);

        const tokenContract = new EscrowTokenContract()
        await tokenContract.createEscrowToken(ctx, JSON.stringify(paymentIntention))
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
            throw new Error("Payment Intention ID already used")
        }
        // validate expiration date (maybe)
        return true
    }
    
    async getBlockPrice(ctx){
        return CONFIG.blockPrice;
    }
}

function handlePaymentIntentionAttributes(ctx, id, paymentIntentionAttributes) {
    const { data_id, value_to_freeze, expiration_date, created_at } = JSON.parse(paymentIntentionAttributes);
    const payer_address = ctx.user.address
    const available_funds = value_to_freeze
    const newPaymentIntentionAttributes = {
        id, payer_address, data_id, value_to_freeze, available_funds, expiration_date, created_at
    }
    return newPaymentIntentionAttributes;
}



module.exports = PaymentIntentionContract;
