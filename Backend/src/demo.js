const rsa = require('node-rsa');

const key = new rsa({b: 1024});
key.setOptions({encryptionScheme: 'pkcs1'})
const publicKey = key.exportKey('public');
const privateKey = key.exportKey('private');
console.log(publicKey)
console.log(privateKey)
