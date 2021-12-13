const crypto = require('crypto')
const ClientIdentity = require('fabric-shim').ClientIdentity;
const jsrsasign = require('jsrsasign')

class CryptoUtils {
    static getUserAddressFromContext(ctx){
        let cid = new ClientIdentity(ctx.stub)
        const certificateString = new TextDecoder().decode(cid.getIDBytes())
        const address = CryptoUtils.getAddress(certificateString)
        return address
    }

    static getHash(payload) {
        const hash = crypto.createHash('sha256');
        const data = hash.update(payload, 'utf-8');
        return data.digest('hex') 
    }

    static getAddress(certificateString){
        var x509 = new jsrsasign.X509()
        x509.readCertPEM(certificateString)
        const hex = x509.hex
        const fingerprint256 = jsrsasign.KJUR.crypto.Util.hashHex(x509.hex, 'sha256')
        return fingerprint256
    }

    static getPublicKeyPEM(certificateString){
        var x509 = new jsrsasign.X509()
        x509.readCertPEM(certificateString)
        const public_key = x509.getPublicKey()
        return jsrsasign.KEYUTIL.getPEM(public_key)
    }

    static verifySignature(publicKeyPEM, signature, payload){
        const publicKey = crypto.createPublicKey(publicKeyPEM)
        const verify = crypto.createVerify('SHA256');
        verify.update(payload);
        verify.end();
        return verify.verify(publicKey, signature, 'hex')
    }
}

module.exports = CryptoUtils;
