peer chaincode invoke \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    -C mychannel \
    -n biobank \
    --peerAddresses localhost:7051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
    -c '{"function":"DataContract:uploadRawData",
        "Args":["123", "{ \"title\": \"Meu novo dado de DNA\", \"created_at\": \"Fri Aug 07 2020\", \"url\": \"teste.com\", \"description\": \"descrição stststs\", \"collector\": \"euzinho\", \"owners\": \"eu\", \"price\": \"1000\", \"conditions\": \"essas condições\" }"]}'

"{ \"title\": \"Meu novo dado de DNA\", \"created_at\": \"Fri Aug 07 2020\", \"magnet_link\": \"magnet:?xt=urn:btih:cd04721d0f1251306c30812bc943193d9c5de79f&dn=ubuntu-18.04.5-desktop-amd64.iso&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce\", \"description\": \"descrição stststs\", \"collector\": \"euzinho\", \"owners\": \"eu\", \"price\": \"1000\", \"conditions\": \"essas condições\" }"
"{ \"title\": \"Meu dado de DNA\", \"created_at\": \"Fri Aug 07 2020\", \"magnet_link\": \"magnet:?xt=urn:btih:cd04721d0f1251306c30812bc943193d9c5de79f&dn=ubuntu-18.04.5-desktop-amd64.iso&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce\", \"description\": \"descrição stststs\", \"collector\": \"euzinho\",  \"processor\": \"Intel\", \"owners\": \"eu\", \"price\": \"322\", \"conditions\": \"essas condições\" }"
"{ \"title\": \"Meu dado de DNA\", \"created_at\": \"Fri Aug 07 2020\", \"magnet_link\": \"magnet:?xt=urn:btih:cd04721d0f1251306c30812bc943193d9c5de79f&dn=ubuntu-18.04.5-desktop-amd64.iso&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce\", \"description\": \"update this data\", \"collector\": \"euzinho\",  \"processor\": \"Intel\", \"owners\": \"eu\", \"price\": \"322\", \"conditions\": \"essas condições\", \"type\": \"processed_data\" }"

"{\"name\": \"myProcessor\", \"organization\": \"organizationX\", \"created_at\": \"Fri Aug 07 2020\"}"
"{\"data_id\": \"2\", \"type\": \"upload\", \"user\": \"usuarioX\", \"transaction_id\": \"123123xxxx\", \"created_at\": \"Fri Aug 07 2020\"}"
"{\"processor_id\": \"1\", \"raw_data_id\": \"123\", \"processed_data_id\": \"321\", \"status\": \"not_processed\", \"created_at\": \"Fri Aug 07 2020\"}"

peer chaincode invoke \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    -C mychannel \
    -n qscc \
    --peerAddresses localhost:7051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
    -c '{"function":"GetTransactionByID", 
        "Args":["mychannel", "2425e8a01cbc865f083c418d7ecbc195df5f8a9cadaf59da9e2be228e16e43d9"]}'

peer chaincode invoke \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    -C mychannel \
    -n biobank \
    --peerAddresses localhost:7051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
    -c '{"function":"DataContract:getDataHistory", 
        "Args":["123"]}'


peer chaincode query -C mychannel -n basic -c '{"Args":["getAllAssets"]}'


---------------- deploying a smart contract ----------------------

peer lifecycle chaincode package fabcar.tar.gz \
    --path ../contract/ \
    --lang node \
    --label fabcar_1


peer lifecycle chaincode install fabcar.tar.gz

peer lifecycle chaincode queryinstalled

peer lifecycle chaincode approveformyorg 
    -o localhost:7050
    --ordererTLSHostnameOverride orderer.example.com
    --channelID mychannel
    --name fabcar
    --version 1.0
    --package-id $CC_PACKAGE_ID
    --sequence 1
    --tls
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

peer lifecycle chaincode checkcommitreadiness
    --channelID mychannel
    --name fabcar
    --version 1.0
    --sequence 1
    --tls
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
    --output json

peer lifecycle chaincode commit
 -o localhost:7050
 --ordererTLSHostnameOverride orderer.example.com
 --channelID mychannel
 --name fabcar
 --version 1.0
 --sequence 1
 --tls 
 --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
 --peerAddresses localhost:7051
 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt 
 --peerAddresses localhost:9051 
 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID mychannel --name biochain --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
