# Biobank
A community-based genetic Database

## Requirements
* Hyperledger Fabric 2.3.0
* Hyperledger Explorer 1.1.5
* Node.js 15.12.0
* Express.js 4.17.1

### Setting Up
On server
```bash
# Install Hyperledger Fabric
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.3.2 1.5.0

# Clone repository
git clone https://github.com/amazon-biobank/biobank.git

# Up blockchain
cd blockchain/test-network
./start-production-fabric.sh

# Registering some users
cd ../../application/fabric-details
rm -r wallet
node enrollAdmin.js
node registerUser.js

# Creating userAccount in blockchain
cd ../../blockchain/test-network
./createUserAccont.sh

# Setting Up Hyperledger Explorer
cd ../../explorer
# change peer secretKey name in connection-profile/test-network.json
#if needed, change the volume path in docker-compose.yaml
docker-compose up -d

# You can monitor you network 
./monitordocker.sh fabric_network
```

On Client
```bash
# Clone repository
git clone https://github.com/amazon-biobank/biobank.git

# Configure application/services/connectService.js to use remote-connection.json
# Configure application/fabric-details/remote-connection.json according to servers' file (biobank/blockchain/organizations/peerOrganizations/org1.example.com/connection-org1.json). Don't forget to change server's IP address
# Get admin and user certificate, from server. (biobank/application/fabric-details/wallet)

# Up client application
cd application
npm install
node index.js
```

## Usage
From client, just launch the Web Browser to localhost:3000.

You can do the login using the certificates extracted from the server
