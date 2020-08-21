const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs')

class ConnectService {
  async connectNetwork() {
    const walletPath = path.join(process.cwd(), 'fabric-details/wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const connectionProfilePath = path.resolve(__dirname, '..', '..',  'blockchain', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    let connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));

    const gateway = new Gateway();
    let connectionOptions = { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true }};
    await gateway.connect(connectionProfile, connectionOptions);

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('biobank');

    return { network, contract, gateway }
 }
}

module.exports = ConnectService;
