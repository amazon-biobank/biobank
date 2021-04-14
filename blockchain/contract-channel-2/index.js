'use strict';

const DataContract = require('./lib/data/data-contract');
// const ProcessorContract = require('./lib/processor/processor-contract');
// const OperationContract = require('./lib/operation/operation-contract');
// const ProcessRequestContract = require('./lib/process-request/process-request-contract');
// const AccountContract = require('./lib/account/account-contract');
// const BiocoinContract = require('./lib/biocoin/biocoin-contract');
// const DnaContractContract = require('./lib/dna-contract/dna-contract-contract');
const TestContract = require('./lib/test/test-contract');

// module.exports.DataContract = DataContract;
// module.exports.ProcessRequestContract = ProcessRequestContract;
// module.exports.ProcessorContract = ProcessorContract;
// module.exports.OperationContract = OperationContract;
// module.exports.AccountContract = AccountContract;
// module.exports.BiocoinContract = BiocoinContract;
// module.exports.DnaContractContract = DnaContractContract;
module.exports.TestContract = TestContract;

module.exports.contracts = [ DataContract, ProcessRequestContract, ProcessorContract, OperationContract, AccountContract, BiocoinContract, DnaContractContract];
