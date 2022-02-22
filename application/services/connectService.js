const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs')
const os = require('os')
const { X509Certificate } = require('crypto')
const jsrsasign = require('jsrsasign')
const ControllerUtil = require('./../controllers/ControllerUtil')
const axios = require('axios')
require('dotenv').config()




class ConnectService {
  constructor() {
    this.walletPath = path.join(process.cwd(), 'fabric-details/wallet');

    if(process.env.CONTEXT=='microfabric'){
      this.connectionProfilePath = path.resolve(__dirname, '..', 'fabric-details', 'connection.json');
      this.asLocalhost = true
    }
    else if(process.env.CONTEXT=='remote'){
      this.connectionProfilePath = path.resolve(os.tmpdir(), 'biobank-app', 'remote-connection-larc.json')
      this.asLocalhost = false
    }
  }
  
  async connectNetwork(channel, chaincode) {
    const wallet = await Wallets.newFileSystemWallet(this.walletPath);
    console.log(`Wallet path: ${this.walletPath}`);


    let connectionProfile = JSON.parse(fs.readFileSync(this.connectionProfilePath, 'utf8'));

    const gateway = new Gateway();
    let connectionOptions = { wallet, identity: 'userCertificate', discovery: { enabled: true, asLocalhost: this.asLocalhost }};
    await gateway.connect(connectionProfile, connectionOptions);

    const network = await gateway.getNetwork(channel);
    const contract = network.getContract(chaincode);

    return { network, contract, gateway }
  }

  async getMyAddress() {
    const wallet = await Wallets.newFileSystemWallet(this.walletPath);
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
