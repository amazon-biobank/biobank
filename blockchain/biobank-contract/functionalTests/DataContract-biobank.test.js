'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');
const CONFIG = require('./config.json');
const TestDatautil = require('./test-utils/test-data-util')

describe('DataContract-biobank' , () => {
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

    describe('uploadRawData', () =>{
        it('should submit uploadRawData transaction', async () => {
            const data = await TestDatautil.createSampleData(gateway)
            assert.strictEqual(data['title'], "Meu dado de DNA");
        }).timeout(10000);
    });

    describe('readData', () =>{
        it('should evaluate readData transaction', async () => {
            await TestDatautil.createSampleData(gateway)
            const arg0 = '123';
            const args = [ arg0];
            const response = await SmartContractUtil.evaluateTransaction('DataContract', 'readData', args, gateway);
            
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
            const response = await SmartContractUtil.submitTransaction('DataContract', 'getAllData', args, gateway);
            
            const json_response = JSON.parse(response.toString())
            assert.strictEqual(json_response.length, 2);
            assert.strictEqual(json_response[0]['title'], "Meu dado de DNA");
            assert.strictEqual(json_response[1]['title'], "DNA Coronavirus");
        }).timeout(10000);
    });
});
