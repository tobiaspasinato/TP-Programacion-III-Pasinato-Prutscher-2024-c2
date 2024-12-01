const multer = require("multer");

const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        const mimetype = file.mimetype;
        const [tipo, extencion] = mimetype.split("/");
        if (tipo !== "image") {
            callback(new Error("El archivo no es una imagen"));
        } else {
            const nombre = file.originalname + "-" + Date.now() + "." + extencion;
            callback(null, nombre);
        }
    },
    destination: (req, file, callback) => {
        callback(null, "public/img");
    }
});

const upload = multer({ storage: storage });

module.exports = upload;