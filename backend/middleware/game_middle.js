const comprobarIDgame = function (req, res, next) {
    const id = req.query.id;
    if (id !== undefined) {
        next();
    } else {
        res.status(401).send("No se ha enviado un id");
    }
};

const otroMiddleware = function (req, res, next) {
    // Lógica del otro middleware
    next();
};

module.exports = {
    comprobarIDgame,
    otroMiddleware
};