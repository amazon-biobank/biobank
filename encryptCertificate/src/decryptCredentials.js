const crypto = require('crypto');
const fs = require('fs');

const lyra2 = require ('../build/Release/lyra2');
const LyraHash = (input, salt, saltLength) => lyra2.getHash(input, salt, saltLength);

const algorithm = 'aes-256-cfb';
//const password = 'teste'; //password used to generate the ciphered certificate

const KEY_SIZE = 32;
const SALT_LENGTH = 16;

const ArrayBufferToBuffer = (arrayBuffer) => {
  const buffer = Buffer.from(arrayBuffer);

  return buffer;
}

const splitKeyIv = (keyHash) => {
  const bufferKey = ArrayBufferToBuffer(keyHash);
  const key = bufferKey.slice(0, KEY_SIZE);
  const iv = bufferKey.slice(KEY_SIZE, KEY_SIZE  + KEY_SIZE / 2);

  return [key, iv];
}

const getCipheredCertificateLocal = () => { //ciphered certificate in credentials folder (DEBUGGING)
  const jsonString = fs.readFileSync('../credentials/encryptedCredentials.json');
  const credentials = JSON.parse(jsonString);

  return [credentials.encrypted_content, credentials.salt];
}

const getCipheredCertificate = (certificate) => {
  const credentials = JSON.parse(certificate);

  return [credentials.encrypted_content, credentials.salt];
}

const generateHash = (password, salt) => {
  const passwordHash = LyraHash(password, salt, SALT_LENGTH);

  return passwordHash;
}

const decrypt = (passwordHash, encrypted_content) => {
  const base64Cypher = Buffer.from(encrypted_content, 'base64');
  const [key, iv] = splitKeyIv(passwordHash);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = decipher.update(base64Cypher, '', 'utf-8');

  return decrypted;
}

const writeDecrypted = (decrypted) => {
  fs.writeFile("../credentials/decryptedCredentials.json", decrypted, function(err, result) {
    if(err) console.log('error', err);
  }); 
}

const formatCredentials = (certificate) => {
  const credentials = JSON.parse(certificate);
  
  if(credentials.hasOwnProperty("credentials")){
    return certificate;
  }
  else{

    const Credentials = {
      "credentials" : {
        "certificate" : credentials.certificate,
        "privateKey" : credentials.privateKey
      },
      "mspId": credentials.orgMSPID,
      "type": "X.509",
      "version": 1
    }

    return JSON.stringify(Credentials)
  }
}

const decryptionScript = (password, certificate) => {
  const [encrypted_content, salt] = getCipheredCertificate(certificate); //encrypted certificate and salt used to hash password
  const passwordHash = generateHash(password, salt);
  const decrypted = decrypt(passwordHash, encrypted_content);
  const formattedDecrypted = formatCredentials(decrypted)

  return formattedDecrypted;
}

exports.decryptionScript = decryptionScript;

