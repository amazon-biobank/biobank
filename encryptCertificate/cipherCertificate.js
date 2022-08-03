const {
    createCipheriv,
  } = require('crypto');
const crypto = require('crypto')
var fs = require('fs')
const { Buffer, } = require('buffer');
var lyra2 = require('./build/Release/lyra2');


function hashPassword(password) {
  const generateSalt = (saltLength) => lyra2.getSalt(saltLength);
  const LyraHash = (input, salt, saltLength) => lyra2.getHash(input, salt, saltLength);

  const salt = generateSalt(16);
  const hashed = LyraHash(password, salt, 16);
  
  return [hashed, salt];
}

function getCertificate() { //certificate in local folder
  try {
    const jsonString = fs.readFileSync('./credentials/certificate.json')
    const decipheredCertificate = JSON.parse(jsonString)
    const sdecipheredCertificate = JSON.stringify(decipheredCertificate)
    return sdecipheredCertificate;
  } catch(err) {
    console.log(err)
  }
}

const algorithm = 'aes-128-cfb';
const password = 'password comes here';
const [hashed, salt] = hashPassword(password);
//console.log(hashed);
//key = hashed.substring(0,16)
//iv = hashed.substring(16,32)

const key = new Int32Array(hashed.slice(0, 16));
const iv = new Int32Array(hashed.slice(16, 32));

const cipher = createCipheriv(algorithm, key, iv);
const decipheredCertificate = getCertificate();

let encrypted = cipher.update(decipheredCertificate, 'utf8', 'base64');
    encrypted += cipher.final('base64');

var credentials = {
  "encrypt_alg": "AES-128-cfb", 
  "encrypted_content": encrypted,
  "hashing_alg": "Lyra2",
  "hashing_mem_cost": 49152,
  "hashing_output_len": 256,
  "hashing_t_cost": 1,
  "salt": salt
};

var credentialsstring = JSON.stringify(credentials);
fs.writeFile("./credentials/credentials.json", credentialsstring, function(err, result) {
  if(err) console.log('error', err);
});
 
