const express = require('express');
const router = express.Router();
const productoSequelize = require('../entity/productoEntity.js');
const { comprobarID, validarTipo } = require("../middleware/producto_middle.js")

const cors = require("cors");
router.use(cors());

const upload = require('../storage/storage.js');

router.get("/", (req, res) => {
    res.send("test: Estas en producto");
});

router.put("/update/:id", validarTipo, async (req, res) => {
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const tipo = req.body.tipo;
    console.log(req.body);
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

router.patch("/restore/:id", async (req, res) => {
    try {
        const resultado = await productoSequelize.update(
            {
                eliminado: false,
            },
            { where: { id: req.params.id } }
        );
        res.status(200).send("Venta restaurada!");
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.get("/listconsola", async (req, res) => {
    try {
        const resultado = await productoSequelize.findAll({
            where: { tipo: "consola" }
        });
        res.render("producto", { productos: resultado });
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.get("/listjuego", async (req, res) => {
    try {
        const resultado = await productoSequelize.findAll({
            where: { tipo: "Juego" }
        });
        res.render("producto", { productos: resultado });
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.get("/listAdmin", async (req, res) => {
    const categoria = req.query.categoria || null;
    const limit = parseInt(req.query.limit) || 6;
    const offset = parseInt(req.query.offset) || 0;

    const whereClause = categoria && categoria !== 'todos' ? { tipo: categoria } : {};
    try {
        const resultado = await productoSequelize.findAll({
            where: whereClause,
            limit,
            offset
        });
        res.render("adminProductos", { productos: resultado });
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.get("/list", async (req, res) => {
    const categoria = req.query.categoria || null;
    const limit = parseInt(req.query.limit) || 6;
    const offset = parseInt(req.query.offset) || 0;

    const whereClause = categoria && categoria !== 'todos' ? { tipo: categoria } : {};
    try {
        const resultado = await productoSequelize.findAll({
            where: whereClause && { eliminado: false },
            limit,
            offset
        });
        res.render("producto", { productos: resultado });
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const resultado = await productoSequelize.update(
            { eliminado: true },
            { where: { id: req.params.id } }
        );
        res.send('Producto "eliminado"!');
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.delete("/borrar/:id", async (req, res) => {
    const resultado = productoSequelize.destroy(
        { where: { id: req.params.id } }
    );
    res.send('Producto "eliminado"!');
});

router.post("/insert", upload.single("image"), validarTipo, async (req, res) => {
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const imagen = req.file.filename;
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

router.get('/:id', async (request, response) => {
    const resultado = await productoSequelize.findByPk(request.params.id);
    response.status(200).send(resultado);
});

module.exports = router;