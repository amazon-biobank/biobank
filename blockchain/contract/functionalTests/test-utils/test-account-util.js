const accountJson = "{ \"public_key\": \"blablabla public key\", \"name\": \"John Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
const accountJson2 = "{ \"public_key\": \"blablabla another public key\", \"name\": \"Emma Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
const SmartContractUtil = require('./../js-smart-contract-util');

class TestAccountUtil {

    static async createSampleAccount(gateway) {
        const arg1 = accountJson;
        const args = [ arg1];
        const response = await SmartContractUtil.submitTransaction('AccountContract', 'createAccount', args, gateway); // Returns buffer of transaction return value
        
        return response
    }

    static async createAnotherSampleAccount(gateway) {
        const arg1 = accountJson2;
        const args = [ arg1];
        const response = await SmartContractUtil.submitTransaction('AccountContract', 'createAccount', args, gateway); // Returns buffer of transaction return value
        
        return response
    }

    static get generatedAddress(){
        return "21ad480117c2dc4d27158c9567712ebf26922e888885d1264e4bb840c2af6772"
    }

    static get anotherGeneratedAddress(){
        return "0b1f9a5303d5d3f8890c50da16ea9f0fc8ea19e0e8f63967c7e1b9954af0fbb4"
    }
}

module.exports = TestAccountUtil;
