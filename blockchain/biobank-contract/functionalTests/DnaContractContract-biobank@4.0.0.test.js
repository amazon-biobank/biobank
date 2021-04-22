/*
* Use this file for functional testing of your smart contract.
* Fill out the arguments and return values for a function and
* use the CodeLens links above the transaction blocks to
* invoke/submit transactions.
* All transactions defined in your smart contract are used here
* to generate tests, including those functions that would
* normally only be used on instantiate and upgrade operations.
* This basic test file can also be used as the basis for building
* further functional tests to run as part of a continuous
* integration pipeline, or for debugging locally deployed smart
* contracts by invoking/submitting individual transactions.
*/
/*
* Generating this test file will also trigger an npm install
* in the smart contract project directory. This installs any
* package dependencies, including fabric-network, which are
* required for this test file to be run locally.
*/

'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');
const TestDnaContractUtil = require('./test-utils/test-dna-contract-util')
const TestAccountUtil = require('./test-utils/test-account-util')
const TestDatautil = require('./test-utils/test-data-util')


describe('DnaContractContract-biobank@4.0.0' , () => {

    const homedir = os.homedir();
    const walletPath = path.join(homedir, '.fabric-vscode', 'v2', 'environments', '1 Org Local Fabric', 'wallets', 'Org1');
    const gateway = new fabricNetwork.Gateway();
    let wallet;
    const identityName = 'Org1 Admin';
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
            const args = [ arg0];
            const response = await SmartContractUtil.evaluateTransaction('DnaContractContract', 'readDnaContract', args, gateway); // Returns buffer of transaction return value
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
            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'getAllDnaContract', args, gateway); // Returns buffer of transaction return value
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.length, 2);
            assert.strictEqual(json_response[1]['dnaId'], "123");
            assert.strictEqual(json_response[0]['dnaId'], "321");
        }).timeout(10000);
    });

    describe('executeContract', () =>{
        it('should submit executeContract buy_dna transaction', async () => {
            // const testAccountUtil = new TestAccountUtil()
            // const user = await testAccountUtil.createUserAccount(gateway)
            // await TestAccountUtil.createAnotherSampleAccount(gateway)

            await TestDatautil.createSampleData(gateway)
            await TestDnaContractUtil.createSampleDnaContract(gateway)

            const arg0 = TestDnaContractUtil.generatedId;
            const arg1 = "{\"type\": \"buy_dna\"}";
            const args = [ arg0, arg1];
            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'executeContract', args, gateway); // Returns buffer of transaction return value
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.type, 'buy');
            // assert.strictEqual(json_response.user, user.address);
        }).timeout(10000);
    });

});
