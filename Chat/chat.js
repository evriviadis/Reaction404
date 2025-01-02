import { CreateSessionOutputFilterSensitiveLog } from "@aws-sdk/client-s3";
import { generateKeyPairSync } from crypto

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

console.log(publicKey)
console.log(publicKey.export({ type: 'pkcs1', format: 'pem' }));
console.log(privateKey.export({ type: 'pkcs1', format: 'pem' }));