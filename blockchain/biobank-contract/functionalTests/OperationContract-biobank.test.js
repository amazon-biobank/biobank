'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');
const CONFIG = require('./config.json');

describe('OperationContract-biobank' , () => {
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

    describe('readOperation', () =>{
        it('should evaluate readOperation transaction', async () => {
            const arg0 = 'ee59d1f0-770d-4a93-9645-b8ead51f45f9';
            const args = [ arg0];
            const response = await SmartContractUtil.evaluateTransaction('OperationContract', 'readOperation', args, gateway);
            if(response.length == 0) { assert.fail("operation " + arg0 + " not found") }
            const json_response = JSON.parse(response.toString())

            assert.ok(json_response.details);
            assert.ok(json_response.input);
            assert.ok(json_response.output);
        }).timeout(10000);
    });
});
