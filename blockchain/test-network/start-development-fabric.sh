

# 1) clear Microfab
for CONTAINER in $(docker ps -f label=fabric-environment-name="1 Org Local Fabric Microfab" -q -a) 
  do 
    docker rm -f ${CONTAINER}
  done

docker volume prune -f


# 2) Microfab config - 1 channel
export MICROFAB_CONFIG='{"port":8080,  "endorsing_organizations": [{"name": "Org1"}],"channels": [{"name": "mychannel","endorsing_organizations": ["Org1"]}]}'


# 3) Start Microfab
START_IMAGE="ibmcom/ibp-microfab:0.0.15"
docker run -e MICROFAB_CONFIG --label fabric-environment-name="1 Org Local Fabric Microfab" -p 8080:8080 $START_IMAGE

# 4) Connect IBM blockchain platform

# 5) deploy chaincodes (biobank and currency)
# 5) edit config file (biobank/blockchain/currency-contract/config.json)
# 6) createUserAccount (biobank/blockchain/test-network/createUserAccount.sh)
./createUserAccount.sh
# 7) export id in application/encryptCertificate/src/e-admin.id


# 8) Export Connection Profile in Blockchain extension
# 9) start application
cd ../../application
node index.js
# 10) enter hyperledger.larc.usp.br:3000
# 11) Login using certificates

