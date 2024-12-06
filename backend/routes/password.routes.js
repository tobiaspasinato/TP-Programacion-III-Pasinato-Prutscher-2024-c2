const express = require('express');
const router = express.Router();

//const passwordController = require('../entity/contraEntity');
const { encriptar, desencriptar } = require("../crypto.js");

router.post('/insert', (req, res) => {
    try {
        const password = req.body.password;
        const user = req.body.user;
        console.log(password);
        console.log(user);
        const passwordEncriptado = encriptar(password);
        // const reultado = passwordController.create({
        //     user: user,
        //     password: passwordEncriptado
        // });
    res.status(200).send(passwordEncriptado);
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

module.exports = router;