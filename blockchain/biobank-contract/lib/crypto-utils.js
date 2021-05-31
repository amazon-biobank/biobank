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
        const fingerprint256 = jsrsasign.KJUR.crypto.Util.sha256(x509.hex)
        return fingerprint256
    }
}

module.exports = CryptoUtils;
