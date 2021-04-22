const { ActiveContext, ActiveContract } = require('./../active-contract')

class TestContract extends ActiveContract {
  // createContext() {
  //     return new OperationContext();
  // }

  async createText(ctx, key, data) {
      return  await ctx.stub.putState(key, data);;
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
