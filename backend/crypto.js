const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const encriptar = (password) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const passwordEncriptado = Buffer.concat([cipher.update(password), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encripted: passwordEncriptado.toString('hex')
    }
};

const desencriptar = (password) => {
    const iv = Buffer.from(password.iv, 'hex');
    const valor = Buffer.from(password.encripted, 'hex');
    const passwordDesencriptado = crypto.createDecipheriv(algorithm, key, iv);
    return Buffer.concat([passwordDesencriptado.update(valor), passwordDesencriptado.final()]).toString();
};

module.exports = { encriptar, desencriptar };