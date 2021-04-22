const SmartContractUtil = require('./../js-smart-contract-util');
const dnaContractJson = "{ \"dnaId\": \"123\", \"parameters\": \{ \"price\": 10 \}, \"created_at\": \"Fri Aug 07 2020\" }"
const dnaContractJson2 = "{ \"dnaId\": \"321\", \"parameters\": \{ \"price\": 12 \}, \"created_at\": \"Fri Aug 07 2020\" }"


class TestDnaContractUtil {
    static async createSampleDnaContract(gateway) {
        const arg0 = dnaContractJson;
        const args = [ arg0];
        const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'createDnaContract', args, gateway); // Returns buffer of transaction return value
            
        return JSON.parse(response.toString())
    }

    static async createAnotherSampleDnaContract(gateway) {
        const arg0 = dnaContractJson2;
        const args = [ arg0 ];
        const response = await SmartContractUtil.submitTransaction('DnaContractContract', 'createDnaContract', args, gateway); // Returns buffer of transaction return value
        
        return JSON.parse(response.toString())
    }

    static get generatedId(){
        return "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
    }
}

module.exports = TestDnaContractUtil;
