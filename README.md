# Biobank
Biodiversity is proposed as a sustainable alternative for the economic development of high-
biodiversity regions. Especially in the field of biodiversity genomics, the development of low-cost DNA
sequencing opens an opportunity for new actors beyond academia to engage in genomic sequencing.
However, it is challenging to adequately compensate local population for their contribution to the innovation
process, preventing better bioeconomy development. Although many repositories register genomic data
to support biodiversity research, they do not facilitate the fair sharing of economical benefits. 
In this work, we propose the creation of the Amazon Biobank, a community-based genetic
database. By combining blockchain and smart contract technologies, it provides adequate benefit-sharing
among all participants who collect, insert, process, store and validate genomic data. It also provides
traceability and auditability, allowing easy association between biotechnological research and DNA data

## Demonstration
We have a video demonstration of the software, presented at the "Tool Session" on the XXI Brazilian Symposium on Information and Computational Systems Security in 2021

https://youtu.be/PqujKOURc44

## About the performance of the system
Our software was designed to be highly scalable, by using as underlying consensus a lightweight RAFT protocol. (See [Wang 2020]( https://doi.org/10.1109/ICDCS47774.2020.00165))
*  Takes less than 1 second to add a new block
*  Can support a throughput of at least 200 transactions per second

In addition, DNA data is distributed using BitTorrent protocol. So, only BitTorrent magnet links are registered on the blockchain. (See [Torrente](https://doi.org/10.5753/sbseg_estendido.2021.17343))
* Size of a BitTorrent magnet link: 20 bytes
* Time to generate a magnet link from a 1 GB file: 18 seconds
* Time to download 1 GB using Torrente and micropayments (2MB/s network): 9 minutes
   - For reference: Time taken to download 1 GB in a conventional BitTorrent without micropayments (2MB/s network): 8 and half minutes

Below are preliminary numbers about some operations of the system. Note that it was measured using a remote private server, contacted via VPN rather than using the public Internet. Also, we used a Hyperledger Fabric test network, instead of a production-ready one.
* Time taken to register a DNA on the blockchain: X seconds
* Time taken to read details about a DNA data: X seconds
* Time taken to buy a DNA: X seconds (note that it requires 3 transactions to the blockchain)


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

# Up client application
cd application
npm install
node index.js
```
For your convenience, you can get the admin certificate in <REMOTE IP>:3000/admin-id. This user is already created and registered.

obs: maybe it is necessary to configure the hosts archive
1) Open /etc/hosts (in linux)
2) Add folowings lines
```
<REMOTE IP>   orderer.example.com
<REMOTE IP>   peer0.org1.example.com
<REMOTE IP>   peer0.org2.example.com
<REMOTE IP>   ca.example.com
```

## Usage
From client, just launch the Web Browser to localhost:3000.

During the setting up, a admin and a user certificate was generated in biobank/application/fabric-details/wallet. Extract these certificates from the server to the client. You can use these certificates to login in the system.

## API
More informations about the API is on the [wiki](https://github.com/amazon-biobank/biobank/wiki)
