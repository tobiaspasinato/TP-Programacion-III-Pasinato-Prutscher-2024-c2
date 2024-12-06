const express = require('express');
const router = express.Router();

const ventasSequelize = require('../entity/ventasEntity.js');
const ventaProductoEntity = require('../entity/ventaProductoEntity.js');
const ProductoSequelize = require('../entity/productoEntity.js');


router.get("/", (req, res) => {
    res.send("test: Estas en ventas");
});

router.get("/list", async (req, res) => {
    let ventasJSON = [];
    try {
        let ventas = await ventasSequelize.findAll({ include: ProductoSequelize });
        const ventasJSON = ventas.map(venta => {
            const jsonVenta = venta.toJSON();
            return {
                ...jsonVenta
            }
        });
        res.status(200).send(ventasJSON);
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.post("/insert", async (req, res) => {
    const total = parseFloat(req.body.total);
    const nombre = req.body.nombre;
    const productos = req.body.productos;
    try {
        const venta = await ventasSequelize.create({
            total: req.body.total,
            nombre: req.body.nombre,
        });
        productos.forEach(async (producto) => {
            ventaProductoEntity.create({
                VentaId: venta.id,
                ProductoId: producto.id,
                cantidad: producto.cantidad,
            })
        });
        res.status(200).send(venta);
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

router.get("/ultimoid", async (req, res) => {
    try {
        const venta = await ventasSequelize.findOne({
            order: [['id', 'DESC']]
        });
        res.status(200).render("ticket", { idVenta : venta });
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

router.delete("/destroy/:id", async (req, res) => {
    try {
        const resultado = await ventasSequelize.destroy({ where: { id: req.params.id } });
        res.status(200).send("Venta eliminada permanentemente!");
    } catch (error) {
        res.status(404).send(`ERROR: ${error}`);
    }
});

module.exports = router;