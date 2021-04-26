const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs')
const { X509Certificate } = require('crypto')
const ControllerUtil = require('./../controllers/ControllerUtil')


class ConnectService {
  constructor() {
    this.walletPath = path.join(process.cwd(), 'fabric-details/wallet');
    
  }
  
  async connectNetwork(channel, chaincode) {
    const wallet = await Wallets.newFileSystemWallet(this.walletPath);
    console.log(`Wallet path: ${this.walletPath}`);

    const connectionProfilePath = path.resolve(__dirname, '..', 'fabric-details', '1OrgLocalFabricOrg1GatewayConnection.json');
    // const connectionProfilePath = path.resolve(__dirname, '..', '..',  'blockchain', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    let connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));

    const gateway = new Gateway();
    // let connectionOptions = { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true }};
    let connectionOptions = { wallet, identity: 'userCertificate', discovery: { enabled: true, asLocalhost: true }};
    await gateway.connect(connectionProfile, connectionOptions);

    const network = await gateway.getNetwork(channel);
    const contract = network.getContract(chaincode);

    return { network, contract, gateway }
 }

  async getMyAddress() {
    const wallet = await Wallets.newFileSystemWallet(this.walletPath);
    const id =  await wallet.get('userCertificate')
    if(id){
      const certificate = new X509Certificate(id.credentials.certificate)
      const publicKey = certificate.publicKey.export({type: 'spki', format: 'pem'})
      return ControllerUtil.getHash(publicKey)
    }
  }
}

module.exports = ConnectService;
