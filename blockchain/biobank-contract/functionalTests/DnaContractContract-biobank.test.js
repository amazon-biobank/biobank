'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');
const CONFIG = require('../config.json');
const TestDnaContractUtil = require('./test-utils/test-dna-contract-util')
const TestDatautil = require('./test-utils/test-data-util')


describe('DnaContractContract-biobank' , () => {
    const homedir = os.homedir();
    const walletPath = path.join(homedir, CONFIG.walletPath);
    const identityName = CONFIG.identityName
    const gateway = new fabricNetwork.Gateway();
    let wallet;
    let connectionProfile;

    before(async () => {
        connectionProfile = await SmartContractUtil.getConnectionProfile();
        wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);
    });

    beforeEach(async () => {
        const discoveryAsLocalhost = SmartContractUtil.hasLocalhostURLs(connectionProfile);
        const discoveryEnabled = true;

        const options = {
            wallet: wallet,
            identity: identityName,
            discovery: {
                asLocalhost: discoveryAsLocalhost,
                enabled: discoveryEnabled
            }
        };

        await gateway.connect(connectionProfile, options);
    });

    afterEach(async () => {
        gateway.disconnect();
    });

    describe('createDnaContract', () =>{
        it('should submit createDnaContract transaction', async () => {
            const arg0 = TestDnaContractUtil.dnaContractJson;
            const args = [ JSON.stringify(arg0)];

            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'createDnaContract', args, gateway);

            const dnaContract = JSON.parse(response.toString())
            assert.strictEqual(dnaContract['dna_id'], '123');
            assert.strictEqual(dnaContract['raw_data_price'], 10);
        }).timeout(10000);

        it('should throw Payment Distribution Parameter Error', async () => {
            var dnaContract = TestDnaContractUtil.dnaContractJson
            dnaContract.payment_distribution.collector = 10000
            const args = [ JSON.stringify(dnaContract) ];

            await assert.rejects(
                SmartContractUtil.submitTransaction('DnaContractContract', 'createDnaContract', args, gateway), 
                (err) => {
                    const regExp = new RegExp("PaymentDistribution Parameter Error")
                    assert(regExp.test(err.message))
                    return true
                })
        }).timeout(10000);

        it('should throw Payment Distribution Parameter sum 100 error', async () => {
            var dnaContract = TestDnaContractUtil.dnaContractJson
            dnaContract.payment_distribution.collector = 5000
            dnaContract.payment_distribution.validators = 5000
            dnaContract.payment_distribution.processor = 5000
            dnaContract.payment_distribution.curator = 5000
            const args = [ JSON.stringify(dnaContract) ];

            await assert.rejects(
                SmartContractUtil.submitTransaction('DnaContractContract', 'createDnaContract', args, gateway), 
                (err) => {
                    const regExp = new RegExp("PaymentDistributionParameters does not sum 100%")
                    assert(regExp.test(err.message))
                    return true
                })
        }).timeout(10000);
    });

    describe('readDnaContract', () =>{
        it('should evaluate readDnaContract transaction', async () => {
            const arg0 = TestDnaContractUtil.dnaContractJson;
            const args = [ JSON.stringify(arg0)];
            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'createDnaContract', args, gateway);
            const dnaContract = JSON.parse(response.toString())

            const args2 = [ dnaContract.id ];
            const response2 = await SmartContractUtil.evaluateTransaction('DnaContractContract', 'readDnaContract', args2, gateway);

            const dnaContract2 = JSON.parse(response2.toString())
            assert.strictEqual(dnaContract2['dna_id'], '123');
        }).timeout(10000);
    });

    describe('getAllDnaContract', () =>{
        it('should submit getAllDnaContract transaction', async () => {
            // has created at least one Dna Contract

            const args = [];
            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'getAllDnaContract', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.length, 2);
            assert.strictEqual(json_response[1]['dnaId'], "123");
        }).timeout(10000);
    });

    describe('executeContract', () =>{
        it('should submit executeContract buy_dna transaction', async () => {
            const dnaContractId = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';
            const arg1 = "{\"type\": \"buy_dna\", \"operationId\": \"123\"}";
            const args = [ dnaContractId, arg1];

            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'executeContract', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.type, 'buy');
        }).timeout(40000);
    });

    describe('executeOperation', () =>{
        it('should executeOperation, given operation and operationPayment', async () => {
            const operationId = "d210c49d-2d50-413b-a476-0377fe99ca95"
            const args = [ operationId ];
            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'executeOperation', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.type, "raw_data");
        }).timeout(10000);
    });

});
