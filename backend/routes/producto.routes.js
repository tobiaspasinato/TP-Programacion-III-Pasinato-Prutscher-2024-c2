const express = require('express');
const router = express.Router();
const productoSequelize = require('../entity/productoEntity.js');
const { comprobarID } = require("../middleware/producto_middle.js")

router.get("/", (req, res) => {
    res.send("test: Estas en producto");
});

router.post("/insert", async (req, res) => {
    try {
        const nombre = req.body.nombre;
        const precio = req.body.precio;
        const imagen = req.body.imagen;
        const tipo = req.body.tipo;
        const resultado = await productoSequelize.create({
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            tipo: tipo
        });
        res.status(200).send("Producto cargado!");
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.get('/:id', async (request, response) => {
    const resultado = await productoSequelize.findByPk(request.params.id);
    response.status(200).send(resultado);
});

module.exports = router;