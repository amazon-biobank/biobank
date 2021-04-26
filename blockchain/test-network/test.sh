CHAINCODE_NAME="fabcar"
SEQUENCE="1"
PACKAGE_NAME=${CHAINCODE_NAME}_${SEQUENCE}

#take package ID
OUTPUT=$(peer lifecycle chaincode queryinstalled)
OUTPUT_LINE=$(echo "${OUTPUT}" | tr -d , | grep ${PACKAGE_NAME})
CC_PACKAGE_ID=$(echo "${OUTPUT_LINE}" | cut -d ' ' -f3 )
echo "${CC_PACKAGE_ID}"