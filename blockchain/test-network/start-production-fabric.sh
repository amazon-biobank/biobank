./network.sh down
./network.sh up createChannel -c mychannel -ca -s couchdb
# ./network.sh createChannel -c channel2 -s couchdb


export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/

./deploy_chaincode.sh "biobank"
./deploy_chaincode.sh "currency"


cd ./../../api
npm install
node index.js &
cd -

cd ./../../application/
npm install
cd - 

cd ./../../application/fabric-details/
rm -r wallet
node enrollAdmin.js
node registerUser.js appUser remote
GREEN='\033[0;32m'; echo -e "${GREEN}Criados certificados em "$(pwd)"/wallet"
cd -

./createUserAccount.sh

cd ./../../../keyguard/
npm install
./start-keyguard.sh remote
cd -
