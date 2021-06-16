'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const TestAccountUtil = require('./test-utils/test-account-util')
const os = require('os');
const CONFIG = require('../config.json');
const path = require('path');

describe('AccountContract-biobank' , () => {
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

    describe('createAccount', () =>{
        it('should submit createAccount transaction', async () => {
            const response = await TestAccountUtil.createSampleAccount(gateway)
            assert.strictEqual(response['name'], "John Smith");
            assert.strictEqual(response['id'], TestAccountUtil.generatedAddress);
            assert.strictEqual(response['balance'], 10e9);
        }).timeout(20000);
    });

    describe('createUserAccount', () =>{
        it('should submit createAccount transaction', async () => {
            const response = await TestAccountUtil.createUserAccount(gateway)
            assert.strictEqual(response['name'], "Org1 Admin");
            assert.strictEqual(response['balance'], 10e9);
        }).timeout(10000);
    });

    describe('readAccount', () =>{
        it('should evaluate readAccount transaction', async () => {
            await TestAccountUtil.createSampleAccount(gateway)

            const arg0 = TestAccountUtil.generatedAddress;
            const args = [ arg0];
            const response = await SmartContractUtil.evaluateTransaction('AccountContract', 'readAccount', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response['name'], "John Smith");
        }).timeout(10000);
    });

    describe('getAllAccount', () =>{
        it('should submit getAllAccount transaction', async () => {
            await TestAccountUtil.createSampleAccount(gateway)
            await TestAccountUtil.createAnotherSampleAccount(gateway)

            const args = [];
            const response = await SmartContractUtil.submitTransaction('AccountContract', 'getAllAccount', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.length, 2);
            assert.strictEqual(json_response[1]['name'], "John Smith");
            assert.strictEqual(json_response[0]['name'], "Emma Smith");
        }).timeout(10000);
    });
});
