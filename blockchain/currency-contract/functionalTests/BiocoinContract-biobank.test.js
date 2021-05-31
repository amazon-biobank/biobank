'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const TestAccountUtil = require('./test-utils/test-account-util')
const os = require('os');
const path = require('path');
const CONFIG = require('./config.json');
const { Test } = require('mocha');
const { doesNotMatch } = require('assert');

describe('BiocoinContract-biobank' , () => {
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

    describe('transferBiocoins', () =>{
        it('should submit transferBiocoins transaction', async () => {
            const testAccountUtil = new TestAccountUtil()
            const user = await TestAccountUtil.createUserAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const arg0 = user.address;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = 10;
            const args = [ arg0, arg1, arg2];
            const response = await SmartContractUtil.submitTransaction('BiocoinContract', 'transferBiocoins', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response[0]['balance'], 0);
            assert.strictEqual(json_response[1]['balance'], 20);
        }).timeout(20000);

        it('should submit parcial transferBiocoins transaction', async () => {
            const testAccountUtil = new TestAccountUtil()
            const user = await TestAccountUtil.createUserAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const arg0 = user.address;
            const arg1 = TestAccountUtil.anotherGeneratedAddress;
            const arg2 = 5.5;
            const args = [ arg0, arg1, arg2];
            const response = await SmartContractUtil.submitTransaction('BiocoinContract', 'transferBiocoins', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response[0]['balance'], 4.5);
            assert.strictEqual(json_response[1]['balance'], 15.5);
        }).timeout(20000);

        it('should raise unauthorized balance error', async () => {
            const testAccountUtil = new TestAccountUtil()
            const user = await TestAccountUtil.createUserAccount(gateway)
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
        }).timeout(20000);

        it('should raise insufficient balance error', async () => {
            const testAccountUtil = new TestAccountUtil()
            const user = await TestAccountUtil.createUserAccount(gateway)
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
        }).timeout(20000);

        it('should raise negative balance error', async () => {
            const testAccountUtil = new TestAccountUtil()
            const user = await TestAccountUtil.createUserAccount(gateway)
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
        }).timeout(20000);
    });

    describe('transferOperationBiocoins', () =>{
        it('should transfer operation biocoins and create a OperationPaymentReceipt', async () => {
            const args = [ "d210c49d-2d50-413b-a476-0377fe99ca95"];
            
            const response = await SmartContractUtil.submitTransaction('BiocoinContract', 'transferOperationBiocoins', args, gateway)
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response['status'], 'paid');
            assert.strictEqual(json_response['id'], "d210c49d-2d50-413b-a476-0377fe99ca95");
        }).timeout(20000);
    });
});
