const express = require('express');
const router = express.Router();
const productoSequelize = require('../entity/productoEntity.js');
const { comprobarID } = require("../middleware/producto_middle.js")

const cors = require("cors");
router.use(cors());

const upload = require('../storage/storage.js');

router.get("/", (req, res) => {
    res.send("test: Estas en producto");
});

router.delete("/delete/:id", comprobarID, async (req, res) => {
    const resultado = productoSequelize.update(
        { eliminado: true },
        { where: { id: req.params.id } }
    );
    res.send('Producto "eliminado"!');
});

router.post("/insert", upload.single("image"), async (req, res) => {
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const imagen = request.file.filename;
    const tipo = req.body.tipo;
    try {
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

router.put("/update/:id", comprobarID, async (req, res) => {
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const tipo = req.body.tipo;
    try {
        const resultado = await productoSequelize.update(
            {
                nombre: nombre,
                precio: precio,
                tipo: tipo
            },
            { where: { id: req.params.id } }
        );
        res.status(200).send("Producto actualizado!");
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.get('/:id', comprobarID, async (request, response) => {
    const resultado = await productoSequelize.findByPk(request.params.id, { where: { eliminado: false } });
    response.status(200).send(resultado);
});

router.get("/list", async (req, res) => {
    const resultado = await productoSequelize.findAll({ where: { eliminado: false } });
    res.status(200).send(resultado);
});

module.exports = router;