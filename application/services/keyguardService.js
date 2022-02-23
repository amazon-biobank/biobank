const path = require('path');
const fs = require('fs')
const https = require('https');
require('dotenv').config()


class KeyguardService {
  static async registerDnaKey(dnaId, secretKey, callback, errorCallback) {
    handleTlsAuthorization()
    const postData = JSON.stringify({ dnaId, secretKey })
    const response = postToKeyguard('/register-dna-key', postData, callback, errorCallback)
    return response
  }

  static async readDnaKey(dnaId, callback, errorCallback) {
    handleTlsAuthorization()
    const response = await getToKeyguard('/read-dna-key', '?dnaId='+ dnaId, callback, errorCallback)
    return response
  }
}

function handleTlsAuthorization(){
  if(process.env.NODE_ENV == 'development'){
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  }
}

function getKeyguardRequestOptions(){
  const userIdPath = path.join(process.cwd(), 'fabric-details/wallet/userCertificate.id');
  const caPath = path.join(process.cwd(), 'fabric-details/ca.crt');
  const userId = fs.readFileSync(userIdPath)
  const keyguardRequestOptions = {
    hostname: getKeyguardHostname(),
    port: 9443,
    cert: JSON.parse(userId.toString()).credentials.certificate,
    key: JSON.parse(userId.toString()).credentials.privateKey,
    ca: fs.readFileSync(caPath), 
  }

  return keyguardRequestOptions

}

function getKeyguardHostname(){
  if(process.env.CONTEXT=='remote'){
    return process.env.REMOTE_HOSTNAME
  } else {
    return process.env.LOCAL_HOSTNAME
  }
}

async function getToKeyguard(path, getQuery, callback, errorCallback){
  let getRequestOptions = getKeyguardRequestOptions()
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
    }
  )
  req.end();
  req.on('error', function(error) {
    errorCallback(error)
  })
}

function postToKeyguard(path, postData, callback, errorCallback){
  let postRequestOptions = getKeyguardRequestOptions()
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
        const response = {
          statusCode: req.res.statusCode,
          data: data.toString()
        }
        callback(response)
      })
    }
  );   
  req.write(postData);
  req.end();
  req.on('error', error => {
    errorCallback(error)
  })
}


module.exports = KeyguardService;
