const express = require('express');
const router = express.Router();
const { comprobarIDconsole } = require("../middleware/console_middle.js")

router.get("/", comprobarIDconsole, (req, res) => {
    res.send("test: Estas en console");
});

module.exports = router;