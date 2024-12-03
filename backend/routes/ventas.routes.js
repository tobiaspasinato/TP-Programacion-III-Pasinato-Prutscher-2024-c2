const express = require('express');
const router = express.Router();

const ventasSequelize = require('../entity/ventasEntity.js');

router.get("/", (req, res) => {
    res.send("test: Estas en ventas");
});

router.get("/list", async (req, res) => {
    try {
        const resultado = await ventasSequelize.findAll();
        res.status(200).send(resultado);
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.post("/insert", async (req, res) => {
    req.body.total = parseFloat(req.body.total);
    req.body.productos = req.body.productos;
    console.log(req.body.productos);
    try {
        const resultado = await ventasSequelize.create({
            total: req.body.total,
            productos: req.body.productos,
        });
        res.status(200).send(resultado);
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.put("/update/:id", async (req, res) => {
    req.body.total = parseFloat(req.body.total);
    req.body.productos = req.body.productos;
    try {
        const resultado = await ventasSequelize.update(
            {
                total: req.body.total,
                productos: req.body.productos,
            },
            { where: { id: req.params.id } }
        );
        res.status(200).send("Venta actualizada!");
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const resultado = await ventasSequelize.update(
            {
                eliminado: true,
            },
            { where: { id: req.params.id } }
        );
        res.status(200).send("Venta eliminada!");
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.patch("/restore/:id", async (req, res) => {
    try {
        const resultado = await ventasSequelize.update(
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

module.exports = router;