const express = require('express');
const app = express();

require("dotenv").config();
console.log(process.env);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const mainRoutes = require('./routes/main.routes');
app.use('/', mainRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Se levantó correctamente");
});