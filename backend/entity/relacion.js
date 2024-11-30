const producto = require('./productoEntity.js');
const ventas = require('./ventasEntity.js');

function relacionarEntidades(){
    producto.belongsToMany(Estacion, {through: 'TrenEstacion'});
    ventas.belongsToMany(Tren, {through: 'TrenEstacion'});
}

module.exports = relacionarEntidades;