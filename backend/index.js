const express = require('express');
const app = express();

require("dotenv").config();
console.log(process.env);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log("Se levantó correctamente");
});