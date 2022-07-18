const {
    createCipheriv,
  } = require('crypto');
const crypto = require('crypto')
var fs = require('fs')
const { createHash, } = require('crypto');

function hashPassword(password) {
  var salt = crypto.randomBytes(24).toString('base64')
  var password_with_salt = password + salt
  const hash = createHash('sha256');
  hash.update(password_with_salt);
  var hashed = hash.digest('base64')

  return [hashed, salt];
}

function getCertificate() { //certificate in local folder
  try {
    const jsonString = fs.readFileSync('./certificate.json')
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
key = hashed.substring(0,16)
iv = hashed.substring(16,32)

const cipher = createCipheriv(algorithm, key, iv);
const decipheredCertificate = getCertificate();

let encrypted = cipher.update(decipheredCertificate, 'utf8', 'base64');
    encrypted += cipher.final('base64');

var credentials = {
  "encrypt_alg": "AES-128-cfb", 
  "encrypted_content": encrypted,
  "hashing_alg": "SHA256",
  "salt": salt
};

var credentialsstring = JSON.stringify(credentials);
fs.writeFile("credentials.json", credentialsstring, function(err, result) {
  if(err) console.log('error', err);
});
 