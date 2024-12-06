const comprobarID = function (req, res, next) {
    const id = req.params.id;
    if (id !== undefined) {
        next();
    } else {
        res.status(401).send("No se ha enviado un id");
    }
};

const validarTipo = function (req, res, next) {
    let tipo = req.body.tipo;
    if (tipo === "juego" || tipo === "consola") {
        next();
    } else {
        res.status(401).send("El tipo no es correcto");
    }
};

module.exports = {
    comprobarID,
    validarTipo
};