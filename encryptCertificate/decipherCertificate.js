const {
    createDecipheriv,
  } = require('crypto');
const { createHash, } = require('crypto');
const fs = require('fs');

function generateKeyIV(password, salt) {
  var password_with_salt = password + salt
  const hash = createHash('sha256');
  hash.update(password_with_salt);
  var hashed = hash.digest('base64')
  
  return [hashed.substring(0,16), hashed.substring(16,32)];
}

function getCipheredCertificate(){ //ciphered certificate in local folder
  try {
    const jsonString = fs.readFileSync('./credentials.json')
    const credentials = JSON.parse(jsonString)
    return [credentials.encrypted_content, credentials.salt]
  } catch(err) {
    console.log(err)
  }
}

const algorithm = 'aes-128-cfb';
const password = 'password comes here'; //password used to generate the ciphered certificate
var [encrypted_content, salt] = getCipheredCertificate(); //encrypted certificate and salt used to hash password
var [key, iv] = generateKeyIV(password, salt);

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = decipher.update(encrypted_content, 'base64', 'utf8');
decrypted += decipher.final('utf8');

fs.writeFile("decipheredCredentials.json", decrypted, function(err, result) {
  if(err) console.log('error', err);
}); 