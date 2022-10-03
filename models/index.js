const nodbConfig = require("../config/nodb.config.js");
const mongoose = require('mongoose');

// Conexión MongoDb Local
const db_path = nodbConfig.dialect + '://' + nodbConfig.HOST + '/' + nodbConfig.noDB;
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
// Local
// mongoose.connect(db_path, config)
//     .then(() => console.log('¡Conexión de DB exitosa!'))
//     .catch(err => {
//         console.error.bind(console, '¡Conexión de DB fallida!')
// });
// Remoto
mongoose.connect(process.env.MONGODB_API)
    .then(() => console.log('¡Conexión de DB exitosa!'))
    .catch(err => {
        console.error.bind(console, '¡Conexión de DB fallida!')
});