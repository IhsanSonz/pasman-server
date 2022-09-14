import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

export const encrypt = (password: string): string => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, process.env.SECRET, iv);
  const encryptedBuffer = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  let bufferLength = Buffer.alloc(1);
  bufferLength.writeUInt8(iv.length, 0);
  const encryptedPassword = Buffer.concat([
    bufferLength,
    iv,
    authTag,
    encryptedBuffer,
  ]);

  return encryptedPassword.toString('hex');
};

export const decrypt = (password: string): string => {
  const dataBuffer = Buffer.from(password, 'hex');
  const ivSize = dataBuffer.readUInt8(0);
  const iv = dataBuffer.slice(1, ivSize + 1);
  // The authTag is by default 16 bytes in AES-GCM
  const authTag = dataBuffer.slice(ivSize + 1, ivSize + 17);
  const decipher = crypto.createDecipheriv(ALGORITHM, process.env.SECRET, iv);
  decipher.setAuthTag(authTag);
  const decryptedPassword = Buffer.concat([
    decipher.update(dataBuffer.slice(ivSize + 17)),
    decipher.final(),
  ]);
  return decryptedPassword.toString();
};
