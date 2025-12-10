const crypto = require('crypto');
const config = require('../config/config');

// Use a consistent key for encryption/decryption
// In production, this should be a secure random 32-byte key stored in environment variables
// For this implementation, we'll derive it from the JWT secret or a fallback if not present
const getEncryptionKey = () => {
    const secret = process.env.ENCRYPTION_KEY || config.jwt.secret;
    // Ensure key is 32 bytes for aes-256-cbc
    return crypto.scryptSync(secret, 'salt', 32);
};

const algorithm = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

const encrypt = (text) => {
    if (!text) return null;

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(algorithm, getEncryptionKey(), iv);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = (text) => {
    if (!text) return null;

    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');

    const decipher = crypto.createDecipheriv(algorithm, getEncryptionKey(), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};

module.exports = {
    encrypt,
    decrypt
};
