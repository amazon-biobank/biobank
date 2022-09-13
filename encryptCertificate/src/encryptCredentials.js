const crypto = require('crypto');
const fs = require('fs');
const { Buffer, } = require('buffer');
const lyra2 = require ('../build/Release/lyra2');
const LyraHash = (input, salt, saltLength) => lyra2.getHash(input, salt, saltLength);
const generateSalt = (saltLength) => lyra2.getSalt(saltLength);

const algorithm = 'aes-256-cfb';
const password = 'teste'

const KEY_SIZE = 32;
const SALT_LENGTH = 16;

const getCertificate = () => { //certificate in local folder
  try {
    const jsonString = fs.readFileSync('../credentials/admin-id.json')
    const decipheredCertificate = JSON.parse(jsonString)
    const sdecipheredCertificate = JSON.stringify(decipheredCertificate)
    return sdecipheredCertificate;
  } catch(err) {
    console.log(err)
  }
}

const ArrayBufferToBuffer = (arrayBuffer) => {
  const buffer = Buffer.from(arrayBuffer);

  return buffer;
}

const generateHashAndSalt = (password) => {
  const salt = generateSalt(SALT_LENGTH);
  const saltBytes = Buffer.from(salt);
  const encodedSalt = saltBytes.toString('base64');
  const passwordHash = LyraHash(password, encodedSalt, SALT_LENGTH);
  return [passwordHash, encodedSalt];
}

const splitKeyIv = (passwordHash) => {
  const bufferKey = ArrayBufferToBuffer(passwordHash);
  const key = bufferKey.slice(0, KEY_SIZE);
  const iv = bufferKey.slice(KEY_SIZE, KEY_SIZE  + KEY_SIZE / 2);
  return [key, iv];
}

const encrypt = (passwordHash, text) => {
  const [key, iv] = splitKeyIv(passwordHash);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(text, 'utf-8');
  const base64Encrypted = Buffer.from(encrypted).toString('base64');
  return base64Encrypted;
}

const encryptionScript = (password, certificate) => {
  const [passwordHash, salt] = generateHashAndSalt(password);
  const encrypted = encrypt(passwordHash, certificate)

  var credentials = {
    "encrypt_alg": "aes-256-cfb", 
    "encrypted_content": encrypted,
    "hashing_alg": "Lyra2",
    "hashing_mem_cost": 1048576,
    "hashing_output_len": 64,
    "hashing_t_cost": 21,
    "salt": salt
  };

  return JSON.stringify(credentials)

}

const writeEncrypted = (password) => {
  const [passwordHash, salt] = generateHashAndSalt(password);
  const certificate = getCertificate();
  const encrypted = encrypt(passwordHash, certificate)


  var credentials = {
    "encrypt_alg": "aes-256-cfb", 
    "encrypted_content": encrypted,
    "hashing_alg": "Lyra2",
    "hashing_mem_cost": 1048576,
    "hashing_output_len": 64,
    "hashing_t_cost": 21,
    "salt": salt
  };

  var credentialsstring = JSON.stringify(credentials);
  fs.writeFile("../credentials/credentialsAdmin.json", credentialsstring, function(err, result) {
  if(err) console.log('error', err);
  });
 
}
 
writeEncrypted(password)

exports.encryptionScript = encryptionScript;