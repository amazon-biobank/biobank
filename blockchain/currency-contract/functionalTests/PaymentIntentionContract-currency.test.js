'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');

describe('PaymentIntentionContract-currency@3.0.0' , () => {

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

    describe('createPaymentIntention', () =>{
        it('should submit createPaymentIntention transaction', async () => {
            const arg0 = '126'
            const arg1 = {
                "magnetic_link": "asdfajojonn2432",
                "value_to_freeze": 1,
                "expiration_date": "Fri Out 07 2020",
                "created_at": "Fri Aug 07 2020"
            }
            const args = [ arg0, JSON.stringify(arg1) ];
            const response = await SmartContractUtil.submitTransaction('PaymentIntentionContract', 'createPaymentIntention', args, gateway);
            
            assert.strictEqual(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('readPaymentIntention', () =>{
        it('should submit readPaymentIntention transaction', async () => {
            const arg0 = '123';
            const args = [ arg0];
            const response = await SmartContractUtil.submitTransaction('PaymentIntentionContract', 'readPaymentIntention', args, gateway);
            
            assert.strictEqual(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });



});
