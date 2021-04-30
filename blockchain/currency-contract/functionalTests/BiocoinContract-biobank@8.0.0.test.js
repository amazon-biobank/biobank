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
    // const identityName = 'user';
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

    describe('transferBiocoins', () =>{
        it('should submit transferBiocoins transaction', async () => {
            const testAccountUtil = new TestAccountUtil()
            const user = await testAccountUtil.createUserAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const arg0 = user.address;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = 10;
            const args = [ arg0, arg1, arg2];
            const response = await SmartContractUtil.submitTransaction('BiocoinContract', 'transferBiocoins', args, gateway); // Returns buffer of transaction return value
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response[0]['balance'], 0);
            assert.strictEqual(json_response[1]['balance'], 20);
        }).timeout(10000);

        it('should submit parcial transferBiocoins transaction', async () => {
            const testAccountUtil = new TestAccountUtil()
            const user = await testAccountUtil.createUserAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const arg0 = user.address;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = 5.5;
            const args = [ arg0, arg1, arg2];
            const response = await SmartContractUtil.submitTransaction('BiocoinContract', 'transferBiocoins', args, gateway); // Returns buffer of transaction return value
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response[0]['balance'], 4.5);
            assert.strictEqual(json_response[1]['balance'], 15.5);
        }).timeout(10000);

        it('should raise unauthorized balance error', async () => {
            const testAccountUtil = new TestAccountUtil()
            const user = await testAccountUtil.createUserAccount(gateway)
            await TestAccountUtil.createSampleAccount(gateway)

            const arg0 = TestAccountUtil.generatedAddress;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = 20;
            const args = [ arg0, arg1, arg2];
            
            await assert.rejects(
                SmartContractUtil.submitTransaction('BiocoinContract', 'transferBiocoins', args, gateway), 
                (err) => {
                    const regExp = new RegExp("unauthorized")
                    assert(regExp.test(err.message))
                    return true
                })
        }).timeout(10000);

        it('should raise insufficient balance error', async () => {
            const testAccountUtil = new TestAccountUtil()
            const user = await testAccountUtil.createUserAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const arg0 = user.address;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = 20;
            const args = [ arg0, arg1, arg2];
            
            await assert.rejects(
                SmartContractUtil.submitTransaction('BiocoinContract', 'transferBiocoins', args, gateway), 
                (err) => {
                    const regExp = new RegExp("balance Insuficient")
                    assert(regExp.test(err.message))
                    return true
                })
        }).timeout(10000);

        it('should raise negative balance error', async () => {
            const testAccountUtil = new TestAccountUtil()
            const user = await testAccountUtil.createUserAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const arg0 = user.address;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = -20;
            const args = [ arg0, arg1, arg2];
            
            await assert.rejects(
                SmartContractUtil.submitTransaction('BiocoinContract', 'transferBiocoins', args, gateway), 
                (err) => {
                    const regExp = new RegExp("invalid Transaction")
                    assert(regExp.test(err.message))
                    return true
                })
        }).timeout(10000);
    });

    describe('transferOperationBiocoins', () =>{
        it('should transfer operation biocoins and create a OperationPaymentReceipt', async () => {
            const args = [ "821f75bc-a914-40d8-9298-eb809a3ef5be"];
            
            const response = await SmartContractUtil.submitTransaction('BiocoinContract', 'transferOperationBiocoins', args, gateway)
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response['status'], 'paid');
            assert.strictEqual(json_response['id'], "821f75bc-a914-40d8-9298-eb809a3ef5be");
        }).timeout(10000);
    });
});
