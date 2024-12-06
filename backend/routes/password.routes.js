const express = require('express');
const router = express.Router();

const passwordController = require('../entity/contraEntity');
const { encriptar, desencriptar } = require("../crypto.js");

router.post('/insert', async (req, res) => {
    try {
        const password = req.body.password;
        const user = req.body.user;
        // Asegúrate de que password sea una cadena
        if (typeof password !== 'string') {
            res.send('ERROR: password debe ser una cadena');
        }

        const passwordEncriptado = encriptar(password);
        const resultado = await passwordController.create({
            user: user,
            encripted: passwordEncriptado
        });

        res.status(200).send(passwordEncriptado);
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.get('/get/:user', async (req, res) => {
    try {
        const user = req.params.user;
        console.log(user);

        // Usar el objeto where para especificar las condiciones de búsqueda
        const password = await passwordController.findOne({ where: { user: user } });

        if (!password) {
            return res.status(404).send('ERROR: No se ha encontrado la contraseña');
        }

        // Asegúrate de que password.encripted no sea undefined
        if (!password.encripted) {
            return res.status(500).send('ERROR: La contraseña encriptada no está disponible');
        }

        const passwordDesencriptado = desencriptar(password.encripted);
        res.status(200).send(passwordDesencriptado);
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

module.exports = router;