const express = require('express');
const router = express.Router();
const { comprobarID } = require("../middleware/producto_middle.js")

router.get("/", comprobarID, (req, res) => {
    res.send("test: Estas en producto");
});

module.exports = router;