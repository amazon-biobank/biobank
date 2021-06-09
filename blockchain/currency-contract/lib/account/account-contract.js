'use strict';

const Account = require('./account.js');
const CryptoUtils = require('./../crypto-utils')
const { ActiveContext, ActiveContract } = require('./../active-contract')
const Dinero = require('./../dinero.js')


class AccountContract extends ActiveContract {
    createContext() {
        return new ActiveContext();
    }

    async createAccount(ctx, accountAttributes) {
        const newAccontAttributes = handleAccountAttributes(accountAttributes)
        const account = Account.createInstance(newAccontAttributes);
        await ctx.accountList.addAccount(account);
        return account;
    }

    async readAccount(ctx, id) {
        const account = await ctx.accountList.getAccount(id);
        return account;
    }

    async getAllAccount(ctx) {
        return await ctx.accountList.getAllAccount();
    }
}

function handleAccountAttributes(accountAttributes) {
    const { certificate, name, created_at } = JSON.parse(accountAttributes);
    const address = CryptoUtils.getAddress(certificate)
    const balance = Dinero({ amount: 10e9 })
    const newAccountAttributes = {
        id: address, address, name, tokens: [], created_at, balance: balance.getAmount()
    }
    return newAccountAttributes;
}

module.exports = AccountContract;
