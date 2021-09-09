const crypto = require('crypto')


class TestPaymentRedeemUtil {
    static createPaymentCommitment(gateway) {
      var commitment = {
        "data": {
          "payment_intention_id": "123",
          "receiver_address": "dbec875335b9be18a34e450ebb16b959c967a4b4c7ee78436bbdfbfa4326dc93",
          "payer_address": "c6595fc7cbbab614947a6a1e1a9fe11304f36aa866267b54ec350a0f9c2f215f",
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
