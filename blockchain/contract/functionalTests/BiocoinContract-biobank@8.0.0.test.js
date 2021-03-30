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
const { Test } = require('mocha');
const { doesNotMatch } = require('assert');

describe('BiocoinContract-biobank@8.0.0' , () => {

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

    describe('transfer_biocoins', () =>{
        it('should submit transfer_biocoins transaction', async () => {
            await TestAccountUtil.createSampleAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const arg0 = TestAccountUtil.generatedAddress;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = 10;
            const args = [ arg0, arg1, arg2];
            const response = await SmartContractUtil.submitTransaction('BiocoinContract', 'transfer_biocoins', args, gateway); // Returns buffer of transaction return value
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response[0]['balance'], 0);
            assert.strictEqual(json_response[1]['balance'], 20);
        }).timeout(10000);

        it('should submit transfer_biocoins transaction', async () => {
            await TestAccountUtil.createSampleAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const arg0 = TestAccountUtil.generatedAddress;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = 5.5;
            const args = [ arg0, arg1, arg2];
            const response = await SmartContractUtil.submitTransaction('BiocoinContract', 'transfer_biocoins', args, gateway); // Returns buffer of transaction return value
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response[0]['balance'], 4.5);
            assert.strictEqual(json_response[1]['balance'], 15.5);
        }).timeout(10000);

        it('should raise insufficient balance error', async () => {
            await TestAccountUtil.createSampleAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const arg0 = TestAccountUtil.generatedAddress;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = 20;
            const args = [ arg0, arg1, arg2];
            
            await assert.rejects(
                SmartContractUtil.submitTransaction('BiocoinContract', 'transfer_biocoins', args, gateway), 
                (err) => {
                    const regExp = new RegExp("balance Insuficient")
                    assert(regExp.test(err.message))
                    return true
                })
        }).timeout(10000);

        it('should raise negative balance error', async () => {
            await TestAccountUtil.createSampleAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const arg0 = TestAccountUtil.generatedAddress;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = -20;
            const args = [ arg0, arg1, arg2];
            
            await assert.rejects(
                SmartContractUtil.submitTransaction('BiocoinContract', 'transfer_biocoins', args, gateway), 
                (err) => {
                    const regExp = new RegExp("invalid Transaction")
                    assert(regExp.test(err.message))
                    return true
                })
        }).timeout(10000);
    });

});