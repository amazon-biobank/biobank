const SmartContractUtil = require('./../js-smart-contract-util');
const dnaJson = "{ \"title\": \"Meu dado de DNA\", \"created_at\": \"Fri Aug 07 2020\", \"magnet_link\": \"magnet:?xt=urn:btih:cd04721d0f1251306c30812bc943193d9c5de79f&dn=ubuntu-18.04.5-desktop-amd64.iso&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce\", \"description\": \"descrição stststs\", \"collector\": \"euzinho\",  \"processor\": \"Intel\", \"owners\": \"eu\", \"price\": \"322\", \"conditions\": \"essas condições\" }"
const dnaJson2 = "{ \"title\": \"DNA Coronavirus\", \"created_at\": \"Fri Aug 07 2020\", \"magnet_link\": \"magnet:?xt=urn:btih:73cac8c3a63c075a6110d562500f51c90ad9ea9c&dn=coronavirus.txt\", \"description\": \"descrição stststs\", \"price\": \"322\", \"conditions\": \"essas condições\" }"


class TestDataUtil {
    static async createSampleData(gateway) {
        const arg0 = '123';
        const arg1 = dnaJson;
        const args = [ arg0, arg1];
        const response = await SmartContractUtil.submitTransaction('DataContract', 'uploadRawData', args, gateway);
        return JSON.parse(response.toString())
    }

    static async createAnotherSampleData(gateway) {
        const arg0 = '321';
        const arg1 = dnaJson2;
        const args = [ arg0, arg1];
        const response = await SmartContractUtil.submitTransaction('DataContract', 'uploadRawData', args, gateway);
        return JSON.parse(response.toString())
    }
}

module.exports = TestDataUtil;
