'use strict';

const DataContract = require('./lib/data/data-contract');
const ProcessorContract = require('./lib/processor/processor-contract');
const OperationContract = require('./lib/operation/operation-contract');
const ProcessRequestContract = require('./lib/process-request/process-request-contract');
const AccountContract = require('./lib/account/account-contract');

module.exports.DataContract = DataContract;
module.exports.ProcessRequestContract = ProcessRequestContract;
module.exports.ProcessorContract = ProcessorContract;
module.exports.OperationContract = OperationContract;
module.exports.AccountContract = AccountContract;

module.exports.contracts = [ DataContract, ProcessRequestContract, ProcessorContract, OperationContract, AccountContract ];
