// const accountJson = "{ \"public_key\": \"-----BEGIN PUBLIC KEY-----\\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEokKxqiGe3B7Pa7eXFAiEdOte5QGk\\nmPolwHN25oxOKlvUomPeKLf9uX0yrO8K3S6zI1A4ZdgOCqWALJYVFklk4Q==\\n-----END PUBLIC KEY-----\\n\", \"name\": \"John Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
// const accountJson2 = "{ \"public_key\": \"blablabla another public key\", \"name\": \"Emma Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
// const { X509Certificate } = require('crypto')
const SmartContractUtil = require('./../js-smart-contract-util');
const dnaJson = "{ \"title\": \"Meu dado de DNA\", \"created_at\": \"Fri Aug 07 2020\", \"magnet_link\": \"magnet:?xt=urn:btih:cd04721d0f1251306c30812bc943193d9c5de79f&dn=ubuntu-18.04.5-desktop-amd64.iso&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce\", \"description\": \"descrição stststs\", \"collector\": \"euzinho\",  \"processor\": \"Intel\", \"owners\": \"eu\", \"price\": \"322\", \"conditions\": \"essas condições\" }"
const dnaJson2 = "{ \"title\": \"DNA Coronavirus\", \"created_at\": \"Fri Aug 07 2020\", \"magnet_link\": \"magnet:?xt=urn:btih:73cac8c3a63c075a6110d562500f51c90ad9ea9c&dn=coronavirus.txt\", \"description\": \"descrição stststs\", \"price\": \"322\", \"conditions\": \"essas condições\" }"


class TestDataUtil {
    static async createSampleData(gateway) {
        const arg0 = '123';
        const arg1 = dnaJson;
        const args = [ arg0, arg1];
        const response = await SmartContractUtil.submitTransaction('DataContract', 'uploadRawData', args, gateway); // Returns buffer of transaction return value
        
        return JSON.parse(response.toString())
    }

    static async createAnotherSampleData(gateway) {
        const arg0 = '321';
        const arg1 = dnaJson2;
        const args = [ arg0, arg1];
        const response = await SmartContractUtil.submitTransaction('DataContract', 'uploadRawData', args, gateway); // Returns buffer of transaction return value
        
        return JSON.parse(response.toString())
    }

    // async createUserAccount(gateway){
    //     const x509 = new X509Certificate(gateway.identity.credentials.certificate)
    //     const publicKey = x509.publicKey.export({type: 'spki', format: 'pem'})


    //     const arg1 = {
    //         "public_key": publicKey,
    //         "name": "Org1 Admin",
    //         "created_at": "Fri Aug 07 2020" 
    //     }
    //     const args = [ JSON.stringify(arg1)];
    //     const response = await SmartContractUtil.submitTransaction('AccountContract', 'createAccount', args, gateway); // Returns buffer of transaction return value
        
    //     return JSON.parse(response.toString())
    // }

    // static get generatedAddress(){
    //     return "fdf596792f25bd37d58b40858be9c36b4828aad1f7632301359daea2e224b17b"
    // }

    // static get anotherGeneratedAddress(){
    //     return "0b1f9a5303d5d3f8890c50da16ea9f0fc8ea19e0e8f63967c7e1b9954af0fbb4"
    // }
}

module.exports = TestDataUtil;
