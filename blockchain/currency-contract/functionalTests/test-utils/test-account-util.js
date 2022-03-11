const accountJson = "{ \"certificate\": \"-----BEGIN CERTIFICATE-----\\nMIIB6zCCAZGgAwIBAgIUDg48hlJDOJt1/YGhrfo186SU+n4wCgYIKoZIzj0EAwIw\\naDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRkwFwYDVQQDExBmYWJyaWMt\\nY2Etc2VydmVyMB4XDTIxMDMyOTEyMTQwMFoXDTIyMDMyOTEyMTkwMFowITEPMA0G\\nA1UECxMGY2xpZW50MQ4wDAYDVQQDEwVhZG1pbjBZMBMGByqGSM49AgEGCCqGSM49\\nAwEHA0IABCYgT9lRLOa74i0bfiHC5NFIgSsarwijmZ511x4/2mEsITs3Rvhgc5Oq\\nRzT+3UXzujMZbcbdmvaTmCEG+a+cK+mjYDBeMA4GA1UdDwEB/wQEAwIHgDAMBgNV\\nHRMBAf8EAjAAMB0GA1UdDgQWBBS7LeGMZtESufB55D7Tvpno/fQlCDAfBgNVHSME\\nGDAWgBQXcViHTp8HeljnJF5Zx+jlIpnXpDAKBggqhkjOPQQDAgNIADBFAiEAzOUi\\n/jV0MZwUv8ZUUaebElCwaoJt1KwG8oyTpe8BAlsCIBzs8WCTvwmKK8cy2yjdoIzC\\nR4sdyGAGlLo8R7JxovpY\\n-----END CERTIFICATE-----\\n\", \"name\": \"John Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
const accountJson2 = "{ \"certificate\": \"-----BEGIN CERTIFICATE-----\\nMIIBzzCCAXSgAwIBAgIQOeTbi9PL+1cVtIDyZY8CejAKBggqhkjOPQQDAjASMRAw\\nDgYDVQQDEwdPcmcxIENBMB4XDTIxMDMyOTE2MDkzMVoXDTMxMDMyNzE2MDkzMVow\\nJTEOMAwGA1UECxMFYWRtaW4xEzARBgNVBAMTCk9yZzEgQWRtaW4wWTATBgcqhkjO\\nPQIBBggqhkjOPQMBBwNCAASiQrGqIZ7cHs9rt5cUCIR0617lAaSY+iXAc3bmjE4q\\nW9SiY94ot/25fTKs7wrdLrMjUDhl2A4KpYAslhUWSWTho4GYMIGVMA4GA1UdDwEB\\n/wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwEwDAYDVR0TAQH/\\nBAIwADApBgNVHQ4EIgQgS+MeRckWZKT/WotAUZ4q8SmK8SInQKyWxCZ0kZpRnaUw\\nKwYDVR0jBCQwIoAgbTev3OhgCw1rMUw7WhmCD6bg9FIqJGayUNsCh4Oc+v8wCgYI\\nKoZIzj0EAwIDSQAwRgIhANaabptRfwoRqYCuXS5DOTp+EYcZzgPXj93iPaJajZxF\\nAiEAnUZbo98yXg961Lr2gC78kAVp9VrWXi8PkmrPx0SKRZw=\\n-----END CERTIFICATE-----\\n\", \"name\": \"Emma Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
const SmartContractUtil = require('./../js-smart-contract-util');


class TestAccountUtil {
    static async createSampleAccount(gateway) {
        const arg1 = accountJson;
        const args = [ arg1];
        const response = await SmartContractUtil.submitTransaction('AccountContract', 'createAccount', args, gateway);
        return JSON.parse(response.toString())
    }

    static async createAnotherSampleAccount(gateway) {
        const arg1 = accountJson2;
        const args = [ arg1 ];
        const response = await SmartContractUtil.submitTransaction('AccountContract', 'createAccount', args, gateway);
        return JSON.parse(response.toString())
    }

    static async createUserAccount(gateway){
        const x509 = gateway.identity.credentials.certificate

        const arg1 = {
            "certificate": x509,
            "name": "Org1 Admin",
            // "name": "John Smith",
            "created_at": "Fri Aug 07 2020" 
        }
        const args = [ JSON.stringify(arg1)];
        const response = await SmartContractUtil.submitTransaction('AccountContract', 'createAccount', args, gateway);
        
        return JSON.parse(response.toString())
    }

    static get generatedAddress(){
        return "749a7937a0343fdc441f84729ff035f90c8a5d06f33ff01005a98446c329e108"
    }

    static get anotherGeneratedAddress(){
        return "54e9615526bad824b5810729cb58d16ae8586c2f98e091650cb04512647ae702"
    }
}

module.exports = TestAccountUtil;
