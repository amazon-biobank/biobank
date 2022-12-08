cd ./../currency-contract
node_modules/.bin/mocha functionalTests/AccountContract-biobank.test.js --grep="createUserAccount"

WALLET_PATH=$(cat config.json | jq '.walletPath' | tr -d \")
IDENTITY_NAME=$(cat config.json | jq '.identityName' | tr -d \" )
cd -


cd ../../application/encryptCertificate/src/
echo $ID
node encryptCredentials.js ~/$WALLET_PATH "${IDENTITY_NAME}.id" teste
echo "encrypted test user"
cd -