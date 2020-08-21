'use strict';

const DataContract = require('./lib/data/data-contract');
const ProcessRequestContract = require('./lib/process-request-contract');
const ProcessorContract = require('./lib/processor/processor-contract');
const OperationContract = require('./lib/operation/operation-contract');

module.exports.DataContract = DataContract;
module.exports.ProcessRequestContract = ProcessRequestContract;
module.exports.ProcessorContract = ProcessorContract;
module.exports.OperationContract = OperationContract;
module.exports.contracts = [ DataContract, ProcessRequestContract, ProcessorContract, OperationContract ];
