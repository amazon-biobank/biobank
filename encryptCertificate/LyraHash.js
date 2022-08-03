const { SlowBuffer } = require('buffer');
var lyra2 = require('./build/Release/lyra2');

const generateSalt = (saltLength) => lyra2.getSalt(saltLength);
const LyraHash = (input, salt, saltLength) => lyra2.getHash(input, salt, saltLength);

const salt = generateSalt(16)
console.log(salt);
const arrayBuffer = LyraHash("test", salt, 16);
console.log(arrayBuffer)
var hashed = new TextDecoder("utf-16").decode(arrayBuffer);
console.log(hashed)
//console.log(hashed.substring(0,16));
//console.log(hashed.substring(16,32));

