'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');
const CONFIG = require('../config.json');
const TestPaymentRedeemUtil = require('./test-utils/test-payment-redeem-util.js')

describe('RedeemContract' , () => {
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

    describe('redeem', () =>{
      it('should submit redeem transaction', async () => {
          var arg0 = TestPaymentRedeemUtil.createPaymentCommitment(gateway)
          console.log(arg0)
          const arg1 = 'c116fb6ef14ff4a9dc6b681314ec63e9c2853c559b7bf205a035fa438d7d3a21';
          const arg2 = '3';
          const args = [ JSON.stringify(arg0), arg1, arg2];
          const response = await SmartContractUtil.submitTransaction('RedeemContract', 'redeem', args, gateway);
          
          assert.strictEqual(response.toString(), true);
      }).timeout(10000);

      it('should give commitment hash error', async () => {
          var arg0 = TestPaymentRedeemUtil.createPaymentCommitment(gateway)
          arg0.commitment_hash = '123'
          const arg1 = 'EXAMPLE';
          const arg2 = 'EXAMPLE';
          const args = [ JSON.stringify(arg0), arg1, arg2];
          
          await assert.rejects(
              SmartContractUtil.submitTransaction('RedeemContract', 'redeem', args, gateway),
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
              SmartContractUtil.submitTransaction('RedeemContract', 'redeem', args, gateway),
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
              SmartContractUtil.submitTransaction('RedeemContract', 'redeem', args, gateway),
              (err) => {
                  const regExp = new RegExp("hashLinkIndex is incorrect")
                  assert(regExp.test(err.message))
                  return true
              })
      }).timeout(10000);
  });


});
