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
const TestAccountUtil = require('./test-utils/test-account-util')
const os = require('os');
const path = require('path');

describe('AccountContract-biobank@2.0.0' , () => {

    const homedir = os.homedir();
    // const walletPath = path.join(homedir, '.fabric-vscode', 'v2', 'environments', '1 Org Local Fabric', 'wallets', 'Org1');
    const walletPath = path.join(homedir, '.fabric-vscode', 'environments', 'testNetwork', 'wallets', 'Org1');
    const identityName = 'user';
    // const walletPath = path.join(process.cwd(), '..','..','application', 'fabric-details/wallet');
    // const identityName = 'admin';
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

    describe('createAccount', () =>{
        it('should submit createAccount transaction', async () => {
            const response = await TestAccountUtil.createSampleAccount(gateway)
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response['name'], "John Smith");
            assert.strictEqual(json_response['id'], TestAccountUtil.generatedAddress);
            assert.strictEqual(json_response['balance'], 10);
        }).timeout(10000);
    });

    describe('readAccount', () =>{
        it('should evaluate readAccount transaction', async () => {
            await TestAccountUtil.createSampleAccount(gateway)

            const arg0 = TestAccountUtil.generatedAddress;
            const args = [ arg0];
            const response = await SmartContractUtil.evaluateTransaction('AccountContract', 'readAccount', args, gateway); // Returns buffer of transaction return value
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response['name'], "John Smith");
        }).timeout(10000);
    });

    describe('getAllAccount', () =>{
        it('should submit getAllAccount transaction', async () => {
            await TestAccountUtil.createSampleAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const args = [];
            const response = await SmartContractUtil.submitTransaction('AccountContract', 'getAllAccount', args, gateway); // Returns buffer of transaction return value
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.length, 2);
            assert.strictEqual(json_response[1]['name'], "John Smith");
            assert.strictEqual(json_response[0]['name'], "Emma Smith");
        }).timeout(10000);
    });
});
