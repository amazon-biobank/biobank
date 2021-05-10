'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');
const CONFIG = require('./config.json');
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
            const dnaContract = await TestDnaContractUtil.createSampleDnaContract(gateway)
            assert.strictEqual(dnaContract['dnaId'], '123');
            assert.strictEqual(dnaContract['parameters']['price'], 10);
        }).timeout(10000);
    });

    describe('readDnaContract', () =>{
        it('should evaluate readDnaContract transaction', async () => {
            await TestDnaContractUtil.createSampleDnaContract(gateway)
            const arg0 = TestDnaContractUtil.generatedId;
            const args = [ arg0 ];
            const response = await SmartContractUtil.evaluateTransaction('DnaContractContract', 'readDnaContract', args, gateway);
            const dnaContract = JSON.parse(response.toString())
            assert.strictEqual(dnaContract['dnaId'], '123');
        }).timeout(10000);
    });

    describe('getAllDnaContract', () =>{
        it('should submit getAllDnaContract transaction', async () => {
            await TestDatautil.createSampleData(gateway)
            await TestDatautil.createAnotherSampleData(gateway)
            await TestDnaContractUtil.createSampleDnaContract(gateway)
            await TestDnaContractUtil.createAnotherSampleDnaContract(gateway)
            const args = [];
            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'getAllDnaContract', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.length, 2);
            assert.strictEqual(json_response[1]['dnaId'], "123");
            assert.strictEqual(json_response[0]['dnaId'], "321");
        }).timeout(10000);
    });

    describe('executeContract', () =>{
        it('should submit executeContract buy_dna transaction', async () => {
            await TestDatautil.createSampleData(gateway)
            await TestDnaContractUtil.createSampleDnaContract(gateway)

            const arg0 = TestDnaContractUtil.generatedId;
            const arg1 = "{\"type\": \"buy_dna\"}";
            const args = [ arg0, arg1];
            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'executeContract', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.type, 'buy');
        }).timeout(10000);
    });

    describe('executeOperation', () =>{
        it('should executeOperation, given operation and operationPayment', async () => {
            await TestDatautil.createSampleData(gateway)
            await TestDnaContractUtil.createSampleDnaContract(gateway)

            const arg0 = "d210c49d-2d50-413b-a476-0377fe99ca95"
            const args = [ arg0 ];
            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'executeOperation', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.type, "raw_data");
        }).timeout(10000);
    });

});
