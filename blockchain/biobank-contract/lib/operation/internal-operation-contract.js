'use strict';

const Operation = require('./operation.js');
const OperationContract = require('./operation-contract.js');

class InternalOperationContract extends OperationContract {
  async createOperation(ctx, id, operationAttributes) {
    if(await this.operationExists(ctx, id)){
      throw new Error("operation already exists")
    }
    const newOperationAttributes = handleOperationAttributes(ctx, id, operationAttributes)
    const operation = Operation.createInstance(newOperationAttributes);
    await ctx.operationList.addOperation(operation);
    return operation;
  }
}

function handleOperationAttributes(ctx, id, operationAttributes) {
  const { type, userAddress, created_at, details, input, output } = JSON.parse(operationAttributes);
  details.transaction_id = ctx.stub.getTxID()
  const newOperationAttributes = {
      id, type, userAddress, created_at, details, input, output
  }
  return newOperationAttributes;
}


module.exports = InternalOperationContract;
