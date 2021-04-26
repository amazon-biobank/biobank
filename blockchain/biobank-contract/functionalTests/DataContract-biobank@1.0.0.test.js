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

const TestDatautil = require('./test-utils/test-data-util')

describe('DataContract-biobank@1.0.0' , () => {

    const homedir = os.homedir();
    const walletPath = path.join(homedir, '.fabric-vscode', 'v2', 'environments', '1 Org Local Fabric', 'wallets', 'Org1');
    const identityName = 'Org1 Admin';
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

    describe('uploadRawData', () =>{
        it('should submit uploadRawData transaction', async () => {
            const data = await TestDatautil.createSampleData(gateway)
            assert.strictEqual(data['title'], "Meu dado de DNA");
        }).timeout(10000);
    });

    // describe('uploadProcessedData', () =>{
    //     it('should submit uploadProcessedData transaction', async () => {
    //         // TODO: populate transaction parameters
    //         const arg0 = 'EXAMPLE';
    //         const arg1 = 'EXAMPLE';
    //         const args = [ arg0, arg1];
    //         const response = await SmartContractUtil.submitTransaction('DataContract', 'uploadProcessedData', args, gateway); // Returns buffer of transaction return value
            
    //         // TODO: Update with return value of transaction
    //         // assert.strictEqual(JSON.parse(response.toString()), undefined);
    //     }).timeout(10000);
    // });

    // describe('updateData', () =>{
    //     it('should submit updateData transaction', async () => {
    //         // TODO: populate transaction parameters
    //         const arg0 = 'EXAMPLE';
    //         const arg1 = 'EXAMPLE';
    //         const arg2 = 'EXAMPLE';
    //         const args = [ arg0, arg1, arg2];
    //         const response = await SmartContractUtil.submitTransaction('DataContract', 'updateData', args, gateway); // Returns buffer of transaction return value
            
    //         // TODO: Update with return value of transaction
    //         // assert.strictEqual(JSON.parse(response.toString()), undefined);
    //     }).timeout(10000);
    // });

    describe('readData', () =>{
        it('should evaluate readData transaction', async () => {
            await TestDatautil.createSampleData(gateway)
            const arg0 = '123';
            const args = [ arg0];
            const response = await SmartContractUtil.evaluateTransaction('DataContract', 'readData', args, gateway); // Returns buffer of transaction return value
            
            const data = JSON.parse(response.toString())
            assert.strictEqual(data['title'], "Meu dado de DNA");
        }).timeout(10000);
    });

    describe('getAllData', () =>{
        it('should submit getAllData transaction', async () => {
            // TODO: Update with parameters of transaction
            await TestDatautil.createSampleData(gateway)
            await TestDatautil.createAnotherSampleData(gateway)
            
            const args = [];
            const response = await SmartContractUtil.submitTransaction('DataContract', 'getAllData', args, gateway); // Returns buffer of transaction return value
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.length, 2);
            assert.strictEqual(json_response[0]['title'], "Meu dado de DNA");
            assert.strictEqual(json_response[1]['title'], "DNA Coronavirus");
        }).timeout(10000);
    });

    // describe('getAllRawData', () =>{
    //     it('should submit getAllRawData transaction', async () => {
    //         // TODO: Update with parameters of transaction
    //         const args = [];
    //         const response = await SmartContractUtil.submitTransaction('DataContract', 'getAllRawData', args, gateway); // Returns buffer of transaction return value
            
    //         // TODO: Update with return value of transaction
    //         // assert.strictEqual(JSON.parse(response.toString()), undefined);
    //     }).timeout(10000);
    // });

    // describe('getDataHistory', () =>{
    //     it('should submit getDataHistory transaction', async () => {
    //         // TODO: populate transaction parameters
    //         const arg0 = 'EXAMPLE';
    //         const args = [ arg0];
    //         const response = await SmartContractUtil.submitTransaction('DataContract', 'getDataHistory', args, gateway); // Returns buffer of transaction return value
            
    //         // TODO: Update with return value of transaction
    //         // assert.strictEqual(JSON.parse(response.toString()), undefined);
    //     }).timeout(10000);
    // });

});
