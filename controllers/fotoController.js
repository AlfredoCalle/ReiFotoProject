const multer = require('multer');
const rutaAlmacen = multer.diskStorage({
    destination: function(request, file, callback) {
        callback(null, './public/images/')
    },
    filename: function(request, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    }
});
const filtroImagen = (req, file, callback) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        callback(null, true);
    } else {
        callback(null, false);
        return callback(new Error('Solo se acepta los siguientes formatos .png | .jpg | .jpeg'));
    }
};
const cargar = multer({ storage: rutaAlmacen, fileFilter: filtroImagen });

const nombreCampo = 'imagen';

module.exports = cargar.single(nombreCampo);