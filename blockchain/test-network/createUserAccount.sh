cd ./../currency-contract
node_modules/.bin/mocha functionalTests/AccountContract-biobank.test.js --grep="createUserAccount"

WALLET_PATH=$(cat config.json | jq '.walletPath' | tr -d \")
IDENTITY_NAME=$(cat config.json | jq '.identityName' | tr -d \" )
cd -

GREEN='\033[0;32m'
NC='\033[0m'

cd ../../application/encryptCertificate/src/
node encryptCredentials.js ~/$WALLET_PATH "${IDENTITY_NAME}.id" teste
mv e-admin.id ./../../../
echo -e "${GREEN} generated e-admin.id ${NC}
cd -