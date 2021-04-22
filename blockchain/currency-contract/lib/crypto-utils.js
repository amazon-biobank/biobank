const crypto = require('crypto')
const ClientIdentity = require('fabric-shim').ClientIdentity;
const { X509Certificate } = require('crypto')

class CryptoUtils {
    static getUserAddressFromContext(ctx){
        let cid = new ClientIdentity(ctx.stub)
        const address = CryptoUtils.getAddress(cid.getIDBytes())
        // const x509 = new X509Certificate(cid.getIDBytes())
        return address
    }
    
    static getPublicKeyFromCertificate(certificate){
        const publicKey = certificate.publicKey.export({type: 'spki', format: 'pem'})
        return publicKey
    }

    static getAddressFromPublicKey(public_key) {
        return this.getHash(public_key)
    }

    static getHash(payload) {
        const hash = crypto.createHash('sha256');
        const data = hash.update(payload, 'utf-8');
        return data.digest('hex') 
    }

    static getAddress(certificate){
        const x509 = new X509Certificate(certificate)
        return x509.fingerprint256.replace(/:/g,'')
    }
}

module.exports = CryptoUtils;
