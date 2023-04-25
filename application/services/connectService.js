const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs')
const os = require('os')
const jsrsasign = require('jsrsasign')
const ControllerUtil = require('./../controllers/ControllerUtil')
const WalletSingleton = require('../utils/walletSingleton')
const axios = require('axios')



class ConnectService {
  constructor() {
    
    if(process.env.CONTEXT=='microfabric'){
      this.walletPath = path.join(process.cwd(), 'fabric-details/wallet');
      this.connectionProfilePath = path.resolve(__dirname, '..', '..', '..', '.fabric-vscode/v2/environments/biobank/gateways/Org1 Gateway.json');
      // this.connectionProfilePath = path.resolve(__dirname, '..', 'fabric-details', 'connection.json');
      this.asLocalhost = true
    }
    else if(process.env.CONTEXT=='remote'){
      this.connectionProfilePath = path.resolve(os.tmpdir(), 'biobank-app', 'remote-connection-larc.json')
      this.walletPath = path.resolve(os.tmpdir(), 'biobank-app')
      this.asLocalhost = false
    }else if(process.env.CONTEXT=='localhost'){
      this.connectionProfilePath = path.resolve(__dirname, '..', '..', 'blockchain/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
      this.walletPath = path.resolve(os.tmpdir(), 'biobank-app')
      this.asLocalhost = true
    }
    console.log("connection profile path: ", this.connectionProfilePath)
    console.log("wallet path: ", this.walletPath)
  }
  
  async connectNetwork(channel, chaincode) {
    const wallet = await new WalletSingleton().getWallet()

    let connectionProfile = JSON.parse(fs.readFileSync(this.connectionProfilePath, 'utf8'));

    const gateway = new Gateway();
    let connectionOptions = { wallet, identity: 'userCertificate', discovery: { enabled: true, asLocalhost: this.asLocalhost }};
    await gateway.connect(connectionProfile, connectionOptions);

    const network = await gateway.getNetwork(channel);
    const contract = network.getContract(chaincode);

    return { network, contract, gateway }
  }

  async getMyAddress() {
    const wallet = await new WalletSingleton().getWallet()
    const id =  await wallet.get('userCertificate')
    if(id){
      var x509 = new jsrsasign.X509()
      x509.readCertPEM(id.credentials.certificate)
      const fingerprint256 = jsrsasign.KJUR.crypto.Util.hashHex(x509.hex, 'sha256')
      return fingerprint256
    }
  }


  async updateConnectionProfile(){
    const connectionProfileReq = await (axios.get(process.env.HYPERLEDGER_CONNECTION_PROFILE));
    const connectionProfile = this.connectionProfileAdapt(connectionProfileReq.data)
    await fs.mkdirSync(path.resolve(os.tmpdir(), 'biobank-app'), { recursive: true })
    await fs.writeFileSync( this.connectionProfilePath, JSON.stringify(connectionProfile) )
  }

  connectionProfileAdapt(rawProfile){
    const peerName = Object.keys(rawProfile.peers)[0];
    rawProfile.peers[peerName].url = rawProfile.peers[peerName].url.replace("localhost", process.env.REMOTE_HOSTNAME)
    const caName = Object.keys(rawProfile.certificateAuthorities)[0];
    rawProfile.certificateAuthorities[caName].url = rawProfile.certificateAuthorities[caName].url.replace("localhost", process.env.REMOTE_HOSTNAME)
    return rawProfile;
  }
}

module.exports = ConnectService;
