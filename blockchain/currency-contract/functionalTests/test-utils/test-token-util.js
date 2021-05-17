const accountJson = "{ \"certificate\": \"-----BEGIN CERTIFICATE-----\\nMIIB6zCCAZGgAwIBAgIUDg48hlJDOJt1/YGhrfo186SU+n4wCgYIKoZIzj0EAwIw\\naDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRkwFwYDVQQDExBmYWJyaWMt\\nY2Etc2VydmVyMB4XDTIxMDMyOTEyMTQwMFoXDTIyMDMyOTEyMTkwMFowITEPMA0G\\nA1UECxMGY2xpZW50MQ4wDAYDVQQDEwVhZG1pbjBZMBMGByqGSM49AgEGCCqGSM49\\nAwEHA0IABCYgT9lRLOa74i0bfiHC5NFIgSsarwijmZ511x4/2mEsITs3Rvhgc5Oq\\nRzT+3UXzujMZbcbdmvaTmCEG+a+cK+mjYDBeMA4GA1UdDwEB/wQEAwIHgDAMBgNV\\nHRMBAf8EAjAAMB0GA1UdDgQWBBS7LeGMZtESufB55D7Tvpno/fQlCDAfBgNVHSME\\nGDAWgBQXcViHTp8HeljnJF5Zx+jlIpnXpDAKBggqhkjOPQQDAgNIADBFAiEAzOUi\\n/jV0MZwUv8ZUUaebElCwaoJt1KwG8oyTpe8BAlsCIBzs8WCTvwmKK8cy2yjdoIzC\\nR4sdyGAGlLo8R7JxovpY\\n-----END CERTIFICATE-----\\n\", \"name\": \"John Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
const accountJson2 = "{ \"certificate\": \"-----BEGIN CERTIFICATE-----\\nMIIBzzCCAXSgAwIBAgIQOeTbi9PL+1cVtIDyZY8CejAKBggqhkjOPQQDAjASMRAw\\nDgYDVQQDEwdPcmcxIENBMB4XDTIxMDMyOTE2MDkzMVoXDTMxMDMyNzE2MDkzMVow\\nJTEOMAwGA1UECxMFYWRtaW4xEzARBgNVBAMTCk9yZzEgQWRtaW4wWTATBgcqhkjO\\nPQIBBggqhkjOPQMBBwNCAASiQrGqIZ7cHs9rt5cUCIR0617lAaSY+iXAc3bmjE4q\\nW9SiY94ot/25fTKs7wrdLrMjUDhl2A4KpYAslhUWSWTho4GYMIGVMA4GA1UdDwEB\\n/wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwEwDAYDVR0TAQH/\\nBAIwADApBgNVHQ4EIgQgS+MeRckWZKT/WotAUZ4q8SmK8SInQKyWxCZ0kZpRnaUw\\nKwYDVR0jBCQwIoAgbTev3OhgCw1rMUw7WhmCD6bg9FIqJGayUNsCh4Oc+v8wCgYI\\nKoZIzj0EAwIDSQAwRgIhANaabptRfwoRqYCuXS5DOTp+EYcZzgPXj93iPaJajZxF\\nAiEAnUZbo98yXg961Lr2gC78kAVp9VrWXi8PkmrPx0SKRZw=\\n-----END CERTIFICATE-----\\n\", \"name\": \"Emma Smith\" ,\"created_at\": \"Fri Aug 07 2020\" }"
const SmartContractUtil = require('./../js-smart-contract-util');
const { X509Certificate } = require('crypto')


class TestTokenUtil {
    static async createScrewToken(gateway) {
        const arg0 = '123'; // This DNA must have been created
        const arg1 = '2';
        const arg2 = 'Mon May 16 2024'
        const args = [ arg0, arg1, arg2];
        const response = await SmartContractUtil.submitTransaction('TokenContract', 'createScrewToken', args, gateway); 
        return JSON.parse(response.toString())
    }

    static async createExpiredScrewToken(gateway) {
        const arg0 = '123'; // This DNA must have been created
        const arg1 = '2';
        const arg2 = 'Mon May 16 2020'
        const args = [ arg0, arg1, arg2];
        const response = await SmartContractUtil.submitTransaction('TokenContract', 'createScrewToken', args, gateway); 
        return JSON.parse(response.toString())
    }
}

module.exports = TestTokenUtil;
