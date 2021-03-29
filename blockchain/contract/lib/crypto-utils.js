const crypto = require('crypto')

class TestAccountUtil {
    static getAddressFromPublicKey(public_key) {
        const hash = crypto.createHash('sha256');
        const data = hash.update(public_key, 'utf-8');
        return data.digest('hex') 
    }
}

module.exports = TestAccountUtil;
