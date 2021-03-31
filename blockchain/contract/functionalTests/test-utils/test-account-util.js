const accountJson = "{ \"public_key\": \"-----BEGIN PUBLIC KEY-----\\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEokKxqiGe3B7Pa7eXFAiEdOte5QGk\\nmPolwHN25oxOKlvUomPeKLf9uX0yrO8K3S6zI1A4ZdgOCqWALJYVFklk4Q==\\n-----END PUBLIC KEY-----\\n\", \"name\": \"John Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
const accountJson2 = "{ \"public_key\": \"blablabla another public key\", \"name\": \"Emma Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
const SmartContractUtil = require('./../js-smart-contract-util');
const { X509Certificate } = require('crypto')


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

    async createUserAccount(gateway){
        const x509 = new X509Certificate(gateway.identity.credentials.certificate)
        const publicKey = x509.publicKey.export({type: 'spki', format: 'pem'})


        const arg1 = {
            "public_key": publicKey,
            "name": "Org1 Admin",
            "created_at": "Fri Aug 07 2020" 
        }
        const args = [ JSON.stringify(arg1)];
        const response = await SmartContractUtil.submitTransaction('AccountContract', 'createAccount', args, gateway); // Returns buffer of transaction return value
        
        return JSON.parse(response.toString())
    }

    static get generatedAddress(){
        return "fdf596792f25bd37d58b40858be9c36b4828aad1f7632301359daea2e224b17b"
    }

    static get anotherGeneratedAddress(){
        return "0b1f9a5303d5d3f8890c50da16ea9f0fc8ea19e0e8f63967c7e1b9954af0fbb4"
    }
}

module.exports = TestAccountUtil;
