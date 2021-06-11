'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');
const CONFIG = require('./config.json');
const TestPaymentRedeemUtil = require('./test-utils/test-payment-redeem-util.js')

describe('PaymentRedeemContract-currency@23.0.0' , () => {
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

    describe('createPaymentRedeem', () =>{
        it('should submit createPaymentRedeem transaction', async () => {
            const arg0 = {
              "commitment_hash": "sdfsdfsdfs",
              "redeemed_hash_amount": 0
            }
            const args = [ JSON.stringify(arg0) ];
            const response = await SmartContractUtil.submitTransaction('PaymentRedeemContract', 'createPaymentRedeem', args, gateway);
            
            assert.strictEqual(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('readPaymentRedeem', () =>{
        it('should submit readPaymentRedeem transaction', async () => {
            const arg0 = 'sdfsdfsdfs';
            const args = [ arg0];
            const response = await SmartContractUtil.submitTransaction('PaymentRedeemContract', 'readPaymentRedeem', args, gateway);
            
            assert.strictEqual(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('getAllPaymentRedeem', () =>{
        it('should submit getAllPaymentRedeem transaction', async () => {
            const args = [];
            const response = await SmartContractUtil.submitTransaction('PaymentRedeemContract', 'getAllPaymentRedeem', args, gateway);
            
            assert.strictEqual(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('paymentRedeemExists', () =>{
        it('should submit paymentRedeemExists transaction', async () => {
            const arg0 = 'sdfsdfsdfs';
            const args = [ arg0];
            const response = await SmartContractUtil.submitTransaction('PaymentRedeemContract', 'paymentRedeemExists', args, gateway);
            
            assert.strictEqual(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('redeem', () =>{
        it('should submit redeem transaction', async () => {
            var arg0 = TestPaymentRedeemUtil.createPaymentCommitment(gateway)
            console.log(arg0)
            const arg1 = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';
            const arg2 = '10';
            const args = [ JSON.stringify(arg0), arg1, arg2];
            const response = await SmartContractUtil.submitTransaction('PaymentRedeemContract', 'redeem', args, gateway);
            
            assert.strictEqual(response.toString(), true);
        }).timeout(10000);

        it('should give commitment hash error', async () => {
            var arg0 = TestPaymentRedeemUtil.createPaymentCommitment(gateway)
            arg0.commitment_hash = '123'
            const arg1 = 'EXAMPLE';
            const arg2 = 'EXAMPLE';
            const args = [ JSON.stringify(arg0), arg1, arg2];
            
            await assert.rejects(
                SmartContractUtil.submitTransaction('PaymentRedeemContract', 'redeem', args, gateway),
                (err) => {
                    const regExp = new RegExp("hash invalid")
                    assert(regExp.test(err.message))
                    return true
                })
        }).timeout(10000);

        it('should give signature error', async () => {
            var arg0 = TestPaymentRedeemUtil.createPaymentCommitment(gateway)
            arg0.signature = '123'
            const arg1 = 'EXAMPLE';
            const arg2 = 'EXAMPLE';
            const args = [ JSON.stringify(arg0), arg1, arg2];
            
            await assert.rejects(
                SmartContractUtil.submitTransaction('PaymentRedeemContract', 'redeem', args, gateway),
                (err) => {
                    const regExp = new RegExp("Signature is not correct")
                    assert(regExp.test(err.message))
                    return true
                })
        }).timeout(10000);

        it('should give hashLInk error', async () => {
            var arg0 = TestPaymentRedeemUtil.createPaymentCommitment(gateway)
            const arg1 = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';
            const arg2 = '9';
            const args = [ JSON.stringify(arg0), arg1, arg2];
            
            await assert.rejects(
                SmartContractUtil.submitTransaction('PaymentRedeemContract', 'redeem', args, gateway),
                (err) => {
                    const regExp = new RegExp("hashLinkIndex is incorrect")
                    assert(regExp.test(err.message))
                    return true
                })
        }).timeout(10000);
    });

});
