# run in /test-network

if [ $1 = "biobank" ] 
then 
  echo "Deploying biobank chaincode"
  CHAINCODE_NAME="biobank"
  SEQUENCE="1"        # each time you deploy your chaincode, you need to increment this
  CHANNEL_NAME="channel1"
  PACKAGE_NAME=${CHAINCODE_NAME}_${SEQUENCE}
  CONTRACT_PATH="../biobank-contract/"
fi

if [ $1 = "currency" ] 
then 
  echo "Deploying currency chaincode"
  CHAINCODE_NAME="currency"
  SEQUENCE="1"        # each time you deploy your chaincode, you need to increment this
  CHANNEL_NAME="channel2"
  PACKAGE_NAME=${CHAINCODE_NAME}_${SEQUENCE}
  CONTRACT_PATH="../currency-contract/"
fi

#set environment
export FABRIC_CFG_PATH=$PWD/../config/


peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz --path ${CONTRACT_PATH} --lang node --label ${PACKAGE_NAME}



# set to peer 1
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

#install on peer 1
peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

#take package ID
OUTPUT=$(peer lifecycle chaincode queryinstalled)
OUTPUT_LINE=$(echo "${OUTPUT}" | tr -d , | grep ${PACKAGE_NAME})
CC_PACKAGE_ID=$(echo "${OUTPUT_LINE}" | cut -d ' ' -f3 )
echo "package_id: ${CC_PACKAGE_ID}"

#approve on peer 1
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME} --version 1.0 --package-id ${CC_PACKAGE_ID} --sequence ${SEQUENCE} --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem




# set to peer 2
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME} --version 1.0 --package-id ${CC_PACKAGE_ID} --sequence ${SEQUENCE} --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem



# commit
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME} --version 1.0 --sequence ${SEQUENCE} --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME} --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
