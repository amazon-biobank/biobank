'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const TestTokenUtil = require('./test-utils/test-token-util')
const TestAccountUtil = require('./test-utils/test-account-util')
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
            await TestAccountUtil.createUserAccount(gateway)
            const response =  await TestTokenUtil.createScrewToken(gateway)
            assert.strictEqual(response.tokens[0].value, 1e9);
            assert.strictEqual(response.balance, 9e9);
        }).timeout(10000);
    });

    // ----------------------------------to test this function, you need to desactivate the redeem date verification from screwTokenCreation
    describe('Redeem Screw Token', () =>{
        it('should submit redeem Screw token transaction', async () => {
            await TestAccountUtil.createUserAccount(gateway)
            const user =  await TestTokenUtil.createExpiredScrewToken(gateway)
            assert.strictEqual(user.balance, 9e9);

            const response = await SmartContractUtil.submitTransaction('TokenContract', 'redeemExpiredScrewToken', [user.tokens[0].payment_intention_id], gateway); 
            const response_json = JSON.parse(response.toString())
            assert.ok(response_json.tokens.length == 0);
            assert.strictEqual(response_json.balance, 10e9);
        }).timeout(10000);
    });    
});
