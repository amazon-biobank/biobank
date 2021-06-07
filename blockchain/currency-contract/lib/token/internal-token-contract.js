// const { pathToFileURL } = require('url');
// const { ActiveContext, ActiveContract } = require('./../active-contract')
// const BiocoinOperations = require('./../biocoin/biocoin-operations.js');
// const TokenContract = require('./token-contract.js')

// class InternalTokenContract extends TokenContract {
//     async createScrewToken(ctx, paymentIntention){
//         var user = await BiocoinOperations.withdraw_biocoins(ctx, ctx.user, paymentIntention.value_to_freeze)
//         const screwToken = {
//             payment_intention_id: paymentIntention.id, 
//             value: paymentIntention.value_to_freeze,
//             expiration_date: paymentIntention.expiration_date
//         }
//         user.tokens.push(screwToken)
//         await ctx.accountList.updateAccount(user)
//         return user
//     }
// }


// module.exports = InternalTokenContract;
