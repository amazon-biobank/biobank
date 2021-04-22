const { ActiveContext, ActiveContract } = require('./../active-contract')
const CryptoUtils = require('./../crypto-utils')


class TestContract extends ActiveContract {
  // createContext() {
  //     return new OperationContext();
  // }

  async createText(ctx, data) {
    const userAddress = CryptoUtils.getUserAddressFromContext(ctx)
    // const user = await ctx.accountList.getAccount(userAddress);
    // const data = [
    //   "AccountContract:readAccount", 
    //   [userAddress]
    // ]
    // throw(new Error(JSON.stringify(data)))
    const user = await ctx.stub.invokeChaincode('biobank', data.split(','), 'channel1')
    throw(new Error(JSON.stringify(user)))
    ctx.user = user

      return  await ctx.stub.InvokeChaincode('biobank', data, 'channel1')
  }

  // async readOperation(ctx, id) {
  //     const operation = await ctx.operationList.getOperation(id);
  //     return operation;
  // }

  // async getAllOperation(ctx) {
  //     return await ctx.operationList.getAllOperation();
  // }

  // async getOperationByData(ctx, dataId) {
  //     const allOperation = await this.getAllOperation(ctx);
  //     const filteredOperation = allOperation.filter(function(operation) {
  //         return operation.data_id == dataId
  //     })
  //     return filteredOperation
  // }
}

// function handleOperationAttributes(ctx, id, operationAttributes) {
//   const { data_id, type, user, created_at, details } = JSON.parse(operationAttributes);
//   const newOperationAttributes = {
//       id, data_id, type, user, transaction_id: ctx.stub.getTxID(), created_at, details
//   }
//   return newOperationAttributes;
// }

module.exports = TestContract;
