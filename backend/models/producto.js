class Producto {
    nombre;
    precio;
    imagen;
    tipo;

    constructor(nombre, precio, imagen, tipo) {
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.tipo = tipo;
    }

    constructor() {}

    toJson() {
        return JSON.stringify(this);
    }
}