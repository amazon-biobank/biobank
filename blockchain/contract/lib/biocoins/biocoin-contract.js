// 'use strict';

// const { Contract, Context } = require('fabric-contract-api');
// const Account = require('../account/account.js');
// const AccountList = require('../account/account-list.js');
// const { withdraw_biocoins } = require('./biocoin-operations.js');


// class AccountContext extends Context {
//     constructor() {
//         super();
//         this.accountList = new AccountList(this);
//     }
// }

// class BiocoinContract extends Contract {
//     createContext() {
//         return new AccountContext();
//     }

//     async transfer_biocoins(sender_address, receiver_pk,amount){
//         const sender_account = await ctx.accountList.getAccount(sender_pk);
//         withdraw_biocoins
//         return
//     }

//     async createAccount(ctx, id, accountAttributes) {
//         const newAccontAttributes = handleAccountAttributes(id, accountAttributes)
//         const account = Account.createInstance(newAccontAttributes);
//         await ctx.accountList.addAccount(account);
//         return account;
//     }

//     async readAccount(ctx, id) {
//         const account = await ctx.accountList.getAccount(id);
//         return account;
//     }

//     async getAllAccount(ctx) {
//         return await ctx.accountList.getAllAccount();
//     }
// }

// function handleAccountAttributes(id, accountAttributes) {
//     const { public_key, name, created_at } = JSON.parse(accountAttributes);
//     const newAccountAttributes = {
//         id, public_key, name, created_at, balance: 0
//     }
//     return newAccountAttributes;
// }

// module.exports = BiocoinContract;
