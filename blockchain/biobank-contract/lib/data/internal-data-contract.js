'use strict';

const Data = require('./data.js');
const DataContract = require('./data-contract.js');

class InternalDataContract extends DataContract {
  async changeStatusData(ctx, dataId, status) {
    let dataKey = Data.makeKey([dataId]);
    let data = await ctx.dataList.getData(dataKey);

    data.status = status
    await ctx.dataList.updateState(data);
    return data
  }
}

// function handleOperationAttributes(ctx, id, operationAttributes) {
//   const { type, userAddress, created_at, details, input, output } = JSON.parse(operationAttributes);
//   details.transaction_id = ctx.stub.getTxID()
//   const newOperationAttributes = {
//       id, type, userAddress, created_at, details, input, output
//   }
//   return newOperationAttributes;
// }


module.exports = InternalDataContract;
