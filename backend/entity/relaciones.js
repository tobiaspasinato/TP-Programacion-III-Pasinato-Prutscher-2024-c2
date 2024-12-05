const productoSequelize = require('../entity/productoEntity.js');
const ventasSequelize = require('../entity/ventasEntity.js');

function relacionarEntidades(){
    productoSequelize.belongsToMany(ventasSequelize, {through: 'ProductoVentas'});
    ventasSequelize.belongsToMany(productoSequelize, {through: 'ProductoVentas'});
}

module.exports = relacionarEntidades;