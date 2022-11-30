const path = require('path');
const fs = require('fs')
const formidable = require('formidable')
const os = require('os')
const { Gateway, Wallets, Wallet } = require('fabric-network');
const WalletSingleton = require('../utils/walletSingleton');
const { decryptionScript, } = require('../encryptCertificate/src/decryptCredentials');

class InsertCertificateService {
  constructor(){
    this.walletPath = path.resolve(os.tmpdir(), 'biobank-app', 'userCertificate.id') 
  }

  async insertCertificate(req) {
    const form = new formidable.IncomingForm()
  
    const { files, fields } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) =>{
        if (err) {
          console.log("rejected")
          reject(err);
          return;
        }
        resolve({ files, fields })
      })
    })

    const password = fields.password;
    const string_id = JSON.stringify(JSON.parse(fs.readFileSync(files.certificate.path, 'utf8')))
    const id = JSON.parse(decryptionScript(password, string_id))
    
    const wallet = await new WalletSingleton().getWallet()
    await wallet.put('userCertificate', id)
    return 
  }

  async destroyCertificate(req) {
    const wallet = await new WalletSingleton().getWallet()
    await wallet.remove('userCertificate')
  }

  async isCertificatePresent(){
    const wallet = await new WalletSingleton().getWallet()
    const userId =  await wallet.get('userCertificate')
    return userId
  }
}


module.exports = InsertCertificateService;
