const express = require('express');
const router = express.Router();
const { comprobarIDgame } = require("../middleware/game_middle.js")

router.get("/", comprobarIDgame, (req, res) => {
    res.send("test: Estas en game");
});

module.exports = router;