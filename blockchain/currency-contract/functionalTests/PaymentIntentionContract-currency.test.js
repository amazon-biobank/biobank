'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');
const CONFIG = require('../config.json');

describe('PaymentIntentionContract-currency@3.0.0' , () => {
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


    describe('createPaymentIntention', () =>{
        it('should submit createPaymentIntention transaction', async () => {
            const arg0 = '123'
            const arg1 = {
                "data_id": "asdfajojonn2432",
                "value_to_freeze": 1e9,
                "expiration_date": "Fri Out 07 2020",
                "created_at": "Fri Aug 07 2020"
            }
            const args = [ arg0, JSON.stringify(arg1) ];
            const response = await SmartContractUtil.submitTransaction('PaymentIntentionContract', 'createPaymentIntention', args, gateway);
            const json_response = JSON.parse(response.toString())
            
            assert.strictEqual(json_response.value_to_freeze, 1e9);
            assert.strictEqual(json_response.available_funds, 1e9);
            assert.ok(json_response.payer_address != undefined);
            assert.strictEqual(json_response.id, arg0)
        }).timeout(10000);
    });

    describe('readPaymentIntention', () =>{
        it('should submit readPaymentIntention transaction', async () => {
            const arg0 = '123';
            const args = [ arg0 ];
            const response = await SmartContractUtil.submitTransaction('PaymentIntentionContract', 'readPaymentIntention', args, gateway);
            
            assert.strictEqual(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });



});
