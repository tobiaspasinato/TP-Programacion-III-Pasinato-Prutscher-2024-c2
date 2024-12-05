const productoSequelize = require('../entity/productoEntity.js');
const ventasSequelize = require('../entity/ventasEntity.js');

function relacionarEntidades(){
    productoSequelize.belongsTo(ventasSequelize); // Un producto pertenece a una venta
    ventasSequelize.hasMany(productoSequelize); // Una venta tiene muchos productos
}

module.exports = relacionarEntidades;