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
const dnaContractJson = "{ \"dnaId\": \"123\", \"parameters\": \{ \"price\": 25 \}, \"created_at\": \"Fri Aug 07 2020\" }"


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
            const arg0 = '1234';
            const arg1 = dnaContractJson;
            const args = [ arg0, arg1];
            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'createDnaContract', args, gateway); // Returns buffer of transaction return value
            
            const dnaContract = JSON.parse(response.toString())
            assert.strictEqual(dnaContract['dnaId'], '123');
            assert.strictEqual(dnaContract['parameters']['price'], 25);
        }).timeout(10000);
    });

    describe('readDnaContract', () =>{
        it('should evaluate readDnaContract transaction', async () => {
            // TODO: populate transaction parameters
            const arg0 = 'EXAMPLE';
            const args = [ arg0];
            const response = await SmartContractUtil.evaluateTransaction('DnaContractContract', 'readDnaContract', args, gateway); // Returns buffer of transaction return value
            
            // TODO: Update with return value of transaction
            // assert.strictEqual(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('getAllDnaContract', () =>{
        it('should submit getAllDnaContract transaction', async () => {
            // TODO: Update with parameters of transaction
            const args = [];
            const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'getAllDnaContract', args, gateway); // Returns buffer of transaction return value
            
            // TODO: Update with return value of transaction
            // assert.strictEqual(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

});
