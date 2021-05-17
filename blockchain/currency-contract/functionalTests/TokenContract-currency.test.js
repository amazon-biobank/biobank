'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');
const CONFIG = require('./config.json');


describe('TokenContract-currency' , () => {
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

    describe('createScrewToken', () =>{
        it('should submit createScrewToken transaction', async () => {
            const arg0 = '123'; // This DNA must have been created
            const arg1 = '2';
            const arg2 = 'Mon May 17 2024';
            const args = [ arg0, arg1, arg2];
            const response = await SmartContractUtil.submitTransaction('TokenContract', 'createScrewToken', args, gateway); 
            const response_json = JSON.parse(response.toString())
            
            assert.ok(response_json.tokens, undefined);
        }).timeout(10000);
    });

});
