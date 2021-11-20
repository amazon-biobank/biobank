const SmartContractUtil = require('./../js-smart-contract-util');
const dnaJson = { 
    "created_at": "Fri Aug 07 2020",
    "metadata": {
        "title": "Meu dado de DNA",
        "magnet_link": "magnet:?xt=urn:btih:cd04721d0f1251306c30812bc943193d9c5de79f&dn=ubuntu-18.04.5-desktop-amd64.iso&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce",
        "description": "descrição stststs",
    }
}

const dnaJson2 = { 
    "created_at": "Fri Aug 07 2020",
    "metadata": {
        "title": "Meu dado de DNA",
        "magnet_link": "magnet:?xt=urn:btih:cd04721d0f1251306c30812bc943193d9c5de79f&dn=ubuntu-18.04.5-desktop-amd64.iso&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce",
        "description": "descrição stststs",
    }
}


class TestDataUtil {
    static async createSampleData(gateway) {
        const arg0 = '123';
        const arg1 = JSON.stringify(dnaJson);
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
