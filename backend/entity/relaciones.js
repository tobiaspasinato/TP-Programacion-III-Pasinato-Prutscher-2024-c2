const productoSequelize = require('../entity/productoEntity.js');
const ventasSequelize = require('../entity/ventasEntity.js');
const ventaProductosSequelize = require('../entity/ventaProductoEntity.js');

function relacionarEntidades(){
    productoSequelize.belongsToMany(ventasSequelize, {through: ventaProductosSequelize});
    ventasSequelize.belongsToMany(productoSequelize, {through: ventaProductosSequelize}); 
}

module.exports = relacionarEntidades;