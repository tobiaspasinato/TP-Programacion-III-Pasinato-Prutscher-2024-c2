const comprobarID = function (req, res, next) {
    const id = req.params.id;
    if (id !== undefined) {
        next();
    } else {
        res.status(401).send("No se ha enviado un id");
    }
};

const validarTipo = function (req, res, next) {
    const tipo = req.body.tipo;
    if (tipo === "Juego" || tipo === "Consola") {
        next();
    } else {
        res.status(401).send("El tipo no es correcto");
    }
};

module.exports = {
    comprobarID,
    validarTipo
};