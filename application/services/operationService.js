const { FileSystemWallet, Gateway }  = require('fabric-network');
const path = require('path');
const fs = require('fs')
const DataContract = require('../contract/dataContract');


class OperationService {
  async addUserInDataOwner(dataId, newOwner) {
    const dataContract = new DataContract();
    const data = await dataContract.readData(dataId)
    data.owners.push(newOwner)
    await dataContract.updateData(data)
    return data
 }
}

module.exports = OperationService;
