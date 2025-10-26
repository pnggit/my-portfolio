import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.admin') });

function base64ToBuffer(b64) {
  return Buffer.from(b64, 'base64');
}

function bufferToBase64(buf) {
  return Buffer.from(buf).toString('base64');
}

function ensureKey() {
  const b64 = process.env.ADMIN_PASSWORD_KEY;
  if (!b64) {
    console.error('ADMIN_PASSWORD_KEY missing. Add it to .env.admin (base64 32 bytes).');
    process.exit(1);
  }
  const key = base64ToBuffer(b64);
  if (key.length !== 32) {
    console.error('ADMIN_PASSWORD_KEY must be 32 bytes (base64).');
    process.exit(1);
  }
  return key;
}

function encryptAesGcm(plaintext, key) {
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv, ciphertext, tag };
}

function writeProperties(outPath, props) {
  const lines = [
    `username=${props.username}`,
    `algo=${props.algo}`,
    `iv=${props.iv}`,
    `tag=${props.tag}`,
    `ciphertext=${props.ciphertext}`,
  ];
  fs.writeFileSync(outPath, lines.join('\n'), { encoding: 'utf8' });
}

function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const plaintext = process.env.ADMIN_PASSWORD_PLAINTEXT || 'Sephora1';
  const key = ensureKey();

  try {
    const { iv, ciphertext, tag } = encryptAesGcm(plaintext, key);
    const outProps = {
      username,
      algo: 'aes-256-gcm',
      iv: bufferToBase64(iv),
      tag: bufferToBase64(tag),
      ciphertext: bufferToBase64(ciphertext),
    };

    const outPath = path.resolve(__dirname, '../public/admin.properties');
    writeProperties(outPath, outProps);

    console.log(`Encrypted admin.properties written to: ${outPath}`);
    console.log('Note: encryption key is not stored with the properties file.');
  } catch (err) {
    console.error('Encryption failed:', err.message);
    process.exit(1);
  }
}

main();