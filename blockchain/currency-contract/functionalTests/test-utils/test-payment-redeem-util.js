const crypto = require('crypto')


class TestPaymentRedeemUtil {
    static createPaymentCommitment(gateway) {
      var commitment = {
        "data": {
          "payment_intention_id": "123",
          "receiver_address": "d67155dc4d73600f2647c3de7d997d155e5c192657f225f36073c5082962b230",
          "payer_address": "1bccbe86370143789985ce3b9425fa6dfb3919d7101f973af3e4ef7f3513cb00",
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
