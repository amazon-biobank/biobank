'use strict';

const DataContract = require('./lib/data/data-contract');
const ProcessRequestContract = require('./lib/process-request-contract');
const ProcessorContract = require('./lib/processor/processor-contract');

module.exports.DataContract = DataContract;
module.exports.ProcessRequestContract = ProcessRequestContract;
module.exports.ProcessorContract = ProcessorContract;
module.exports.contracts = [ DataContract, ProcessRequestContract, ProcessorContract ];
