const path = require('path');
const fs = require('fs')
const formidable = require('formidable')


class InsertCertificateService {
  constructor(){
    this.walletPath = path.join(process.cwd(), 'fabric-details/wallet', '/userCertificate.id');
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
    
    const certificatePath = path.join(files.certificate.path, files.certificate.name)
    await fs.rename(files.certificate.path, this.walletPath, () => {})  
    console.log(certificatePath, this.walletPath)
    return
  }

  async destroyCertificate(req) {
    await fs.unlink(this.walletPath, () => {})
  }

  isCertificatePresent(){
    return fs.existsSync(this.walletPath)
  }
}

module.exports = InsertCertificateService;
