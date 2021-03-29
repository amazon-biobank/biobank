const accountJson = "{ \"public_key\": \"blablabla public key\", \"name\": \"John Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
const SmartContractUtil = require('./../js-smart-contract-util');

class TestAccountUtil {

    static async createSampleAccount(id, gateway) {
        const arg0 = id;
        const arg1 = accountJson;
        const args = [ arg0, arg1];
        const response = await SmartContractUtil.submitTransaction('AccountContract', 'createAccount', args, gateway); // Returns buffer of transaction return value
        
        return response
    }
}

module.exports = TestAccountUtil;
