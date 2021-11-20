const crypto = require('crypto')
const path = require('path');
const fs = require('fs')

class TestPaymentRedeemUtil {
    static createPaymentCommitment(walletPath) {
      const payerIdentityName = 'user.id'
      var commitment = {
        "data": {
          "payment_intention_id": "123",
          "receiver_address": "951ed57d405cd401d9cf912c0404b70015ac36c9c656aa632d8a7eaf6673c38c",
          "payer_address": "1c71d711cd7360c5f33570487945522a5a4bc87fd7a7ce6b05dff7af17399d2b",
          "hash_root": "d937d5b3bb5fba451e05500b3739e34e2e4bfdd3d1a58c430d810f944f67ec53",
          "data_id": "cd04721d0f1251306c30812bc943193d9c5de79f"
        },
        "hashing_alg": "SHA-256",
        "signature_alg": "ECDSA",
        "signature": ""
      }
     
      const hash = crypto.createHash('sha256')
      hash.update(JSON.stringify(commitment.data))
      commitment.commitment_hash = hash.digest('hex')

      const idPath = path.join(walletPath, payerIdentityName)
      const id = fs.readFileSync(idPath)
      const credential = JSON.parse(id.toString()).credentials
      const privateKey = crypto.createPrivateKey(credential.privateKey)
      
      const sign = crypto.createSign('SHA256')
      sign.update(JSON.stringify(commitment.data))
      sign.end()
      commitment.signature = sign.sign(privateKey, 'hex')

      return commitment
    };
}

module.exports = TestPaymentRedeemUtil;
