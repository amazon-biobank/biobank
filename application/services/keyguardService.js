const { FileSystemWallet, Gateway }  = require('fabric-network');
const path = require('path');
const fs = require('fs')
const DataContract = require('../contract/dataContract');
const https = require('https');
const { throws } = require('assert');
const { resolve } = require('path');
require('dotenv').config()

const userIdPath = path.join(process.cwd(), 'fabric-details/wallet/userCertificate.id');
const caPath = path.join(process.cwd(), 'fabric-details/ca.crt');
const userId = fs.readFileSync(userIdPath)
const keyguardRequestOptions = {
  hostname: process.env.KEYGUARD_HOSTNAME,
  port: 9443,
  cert: JSON.parse(userId.toString()).credentials.certificate,
  key: JSON.parse(userId.toString()).credentials.privateKey,
  ca: fs.readFileSync(caPath), 
}

class KeyguardService {
  static async registerDnaKey(dnaId, secretKey) {
    if(process.env.NODE_ENV == 'development'){
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }

    const postData = JSON.stringify({ dnaId, secretKey })
    const response = postToKeyguard('/register-dna-key', postData)
    return response
  }

  static async readDnaKey(dnaId, callback) {
    if(process.env.NODE_ENV == 'development'){
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }

    const response = await getToKeyguard('/read-dna-key', '?dnaId='+ dnaId, callback)
    return response
  }
}

async function getToKeyguard(path, getQuery, callback){
  let getRequestOptions = Object.assign({}, keyguardRequestOptions)
  getRequestOptions = Object.assign(getRequestOptions, {
    path: path + getQuery,
    method: 'GET'
    })

  const req = https.request(
    getRequestOptions,
    res => {
      res.on('data', function(data) {
        const response = {
          statusCode: req.res.statusCode,
          data: data.toString()
        }
        callback(response)
      })
      
      res.on('error', error => {
        console.error(error)
      })
    }
  )
  req.end();
}

function postToKeyguard(path, postData){
  let postRequestOptions = Object.assign({}, keyguardRequestOptions)
  postRequestOptions = Object.assign( postRequestOptions, {
    method: 'POST',
    path,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  })

  const req = https.request(
    postRequestOptions,
    res => {
      res.on('data', function(data) {
        console.log(data.toString())
        return data.toString
      })

      res.on('error', error => {
        console.error(error)
      })
    }
  );   

  req.write(postData);
  req.end();
}


module.exports = KeyguardService;
