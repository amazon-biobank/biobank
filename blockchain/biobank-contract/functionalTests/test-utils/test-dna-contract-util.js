const SmartContractUtil = require('./../js-smart-contract-util');
const dnaContractJson = { 
    "dna_id": "123", 
    "raw_data_price": 10,
    "payment_distribution": { 
        "collector": 50,
        "processor": 30,
        "curator": 10,
        "validators": 10 
    },
    "royalty_payments": [ { 
            "type": "one_time_fee",
            "value": 5000000000  
        },
        { 
            "type": "proportional_periodic_fee",
            "value": 5 
        }
    ],
    "created_at": "Fri Aug 07 2020"
}

class TestDnaContractUtil {
    static get dnaContractJson() {
        return  dnaContractJson
    }

    static get generatedId(){
        return "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
    }
}

module.exports = TestDnaContractUtil;
