/*const crypto = require('crypto');

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
*/
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);

// Deriva el IV a partir de la clave y un hash de la contraseña
const generarIV = (password) => {
    return crypto.createHash('sha256').update(password).digest().slice(0, 16); // IV de 16 bytes
};

const encriptar = (password) => {
    const iv = generarIV(password); // Genera el IV derivado de la contraseña
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const passwordEncriptado = Buffer.concat([cipher.update(password), cipher.final()]);
    return passwordEncriptado.toString('hex');
};

const desencriptar = (passwordEncriptado, passwordOriginal) => {
    const iv = generarIV(passwordOriginal); // Recalcula el IV a partir de la contraseña original
    const valor = Buffer.from(passwordEncriptado, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    return Buffer.concat([decipher.update(valor), decipher.final()]).toString();
};

module.exports = { encriptar, desencriptar };
