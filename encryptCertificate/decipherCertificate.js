const {
    createDecipheriv,
  } = require('crypto');
const fs = require('fs');

var lyra2 = require('./build/Release/lyra2');

function generateKeyIV(password, salt) {
  const LyraHash = (input, salt, saltLength) => lyra2.getHash(input, salt, saltLength);

  const hashed = LyraHash(password, salt, 16);
  
  return [new Int32Array(hashed.slice(0, 16)),  new Int32Array(hashed.slice(16, 32))];
}

function getCipheredCertificate(){ //ciphered certificate in local folder
  try {
    const jsonString = fs.readFileSync('./credentials/credentials.json')
    const credentials = JSON.parse(jsonString)
    return [credentials.encrypted_content, credentials.salt]
  } catch(err) {
    console.log(err)
  }
}

const algorithm = 'aes-128-cfb';
const password = 'teste'; //password used to generate the ciphered certificate
var [encrypted_content, salt] = getCipheredCertificate(); //encrypted certificate and salt used to hash password
//const salt = Buffer.from(salt_s, 'base64').toString('utf8');
var [key, iv] = generateKeyIV(password, salt);

console.log(typeof encrypted_content)
console.log(salt)
console.log(typeof salt)

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = decipher.update(encrypted_content, 'base64', 'utf8');
decrypted += decipher.final('utf8');

fs.writeFile("./credentials/decipheredCredentials.json", decrypted, function(err, result) {
  if(err) console.log('error', err);
}); 