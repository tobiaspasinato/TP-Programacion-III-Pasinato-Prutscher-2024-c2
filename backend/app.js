const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

require("dotenv").config();
//console.log(process.env);

const productoSequelize = require('./entity/productoEntity.js');
const ventasSequelize = require('./entity/ventasEntity.js');
const contraSequelize = require('./entity/contraEntity.js');
const sequelize = require('./database/sequelize.js');
const relacionarEntidades = require('./entity/relaciones.js');
relacionarEntidades();

const ejs = require("ejs");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

//desabilita los cors
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.get("/", (req, res) => {
    res.send("Estas en el Main");
});

app.get('/createBD', async (request, response) => {
    try {
        await sequelize.sync({ alter: true });
        await contraSequelize.sync({ alter: true });
        console.log("Tablas creadas");
        response.send("Tablas creadas");
    } catch (error) {
        console.error("Error al crear las tablas:", error);
        response.status(500).send("Error al crear las tablas");
    }
});

const productosRoutes = require('./routes/producto.routes.js');
app.use('/productos', productosRoutes);

const ventasRoutes = require('./routes/ventas.routes.js');
app.use('/ventas', ventasRoutes);

const passwordRoutes = require('./routes/password.routes.js');
app.use('/password', passwordRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});