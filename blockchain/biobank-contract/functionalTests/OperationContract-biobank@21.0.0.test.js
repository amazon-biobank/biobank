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

describe('OperationContract-biobank@21.0.0' , () => {

    const homedir = os.homedir();
    const walletPath = path.join(homedir, '.fabric-vscode', 'environments', 'testNetwork', 'wallets', 'Org1');
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

    // describe('createOperation', () =>{
    //     it('should submit createOperation transaction', async () => {
    //         // TODO: populate transaction parameters
    //         const arg0 = 'EXAMPLE';
    //         const arg1 = 'EXAMPLE';
    //         const args = [ arg0, arg1];
    //         const response = await SmartContractUtil.submitTransaction('OperationContract', 'createOperation', args, gateway); // Returns buffer of transaction return value
            
    //         // TODO: Update with return value of transaction
    //         // assert.strictEqual(JSON.parse(response.toString()), undefined);
    //     }).timeout(10000);
    // });

    describe('readOperation', () =>{
        it('should evaluate readOperation transaction', async () => {
            // TODO: populate transaction parameters
            const arg0 = '1b9bbfe7-291f-40b5-a769-f7b8730b9f9b';
            const args = [ arg0];
            const response = await SmartContractUtil.evaluateTransaction('OperationContract', 'readOperation', args, gateway); // Returns buffer of transaction return value
            const json_response = JSON.parse(response.toString())
            console.log(json_response)
            // TODO: Update with return value of transaction
            // assert.strictEqual(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    // describe('getAllOperation', () =>{
    //     it('should submit getAllOperation transaction', async () => {
    //         // TODO: Update with parameters of transaction
    //         const args = [];
    //         const response = await SmartContractUtil.submitTransaction('OperationContract', 'getAllOperation', args, gateway); // Returns buffer of transaction return value
            
    //         // TODO: Update with return value of transaction
    //         // assert.strictEqual(JSON.parse(response.toString()), undefined);
    //     }).timeout(10000);
    // });

    // describe('getOperationByData', () =>{
    //     it('should submit getOperationByData transaction', async () => {
    //         // TODO: populate transaction parameters
    //         const arg0 = 'EXAMPLE';
    //         const args = [ arg0];
    //         const response = await SmartContractUtil.submitTransaction('OperationContract', 'getOperationByData', args, gateway); // Returns buffer of transaction return value
            
    //         // TODO: Update with return value of transaction
    //         // assert.strictEqual(JSON.parse(response.toString()), undefined);
    //     }).timeout(10000);
    // });

});
