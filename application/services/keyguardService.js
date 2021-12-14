const { FileSystemWallet, Gateway }  = require('fabric-network');
const path = require('path');
const fs = require('fs')
const DataContract = require('../contract/dataContract');
const https = require('https');
const { throws } = require('assert');
require('dotenv').config()

const userIdPath = path.join(process.cwd(), 'fabric-details/wallet/userCertificate.id');
const caPath = path.join(process.cwd(), 'fabric-details/ca.crt');

class KeyguardService {
  static async registerDnaKey(dnaId, secretKey) {
    if(process.env.NODE_ENV == 'development'){
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }

    const postData = JSON.stringify({ dnaId, secretKey })
    const response = postToKeyguard('/register-dna-key', postData)
    return response
  }
}


function postToKeyguard(path, postData){
  const userId = fs.readFileSync(userIdPath)
  const req = https.request(
    {
      hostname: process.env.KEYGUARD_HOSTNAME,
      port: 9443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      },
      cert: JSON.parse(userId.toString()).credentials.certificate,
      key: JSON.parse(userId.toString()).credentials.privateKey,
      ca: fs.readFileSync(caPath), 
    },
    res => {
      res.on('data', function(data) {
        console.log(data.toString())
        return data.toString
      });
    }
  )

  req.write(postData);
  req.end();
}
module.exports = KeyguardService;
