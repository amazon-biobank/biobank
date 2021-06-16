const crypto = require('crypto')


class TestPaymentRedeemUtil {
    static createPaymentCommitment(gateway) {
      var commitment = {
        "data": {
          "payment_intention_id": "123",
          "receiver_address": "54e9615526bad824b5810729cb58d16ae8586c2f98e091650cb04512647ae702",
          "payer_address": "d24118f02199ce3b9a78fa7f37b5416da3a7ef83ad6c1976aefb69890dfe8525",
          "hash_root": "d937d5b3bb5fba451e05500b3739e34e2e4bfdd3d1a58c430d810f944f67ec53",
          "data_id": "cd04721d0f1251306c30812bc943193d9c5de79f"
        },
        "hashing_alg": "SHA-256",
        "signature_alg": "ECDSA",
        "signature": "spoirerwqpoijfsomo"
      }
     
      const hash = crypto.createHash('sha256')
      hash.update(JSON.stringify(commitment.data))
      commitment.commitment_hash = hash.digest('hex')
      
      const credential = gateway.identity.credentials
      const privateKey = crypto.createPrivateKey(credential.privateKey)
      
      const sign = crypto.createSign('SHA256')
      sign.update(JSON.stringify(commitment.data))
      sign.end()
      commitment.signature = sign.sign(privateKey, 'hex')

      return commitment
    };
}

module.exports = TestPaymentRedeemUtil;
