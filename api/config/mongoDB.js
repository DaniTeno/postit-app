const mongoose = require("mongoose")

const mongoConnect = () => {
    const DB_URI = process.env.DB_URI;
    mongoose.connect(DB_URI, {
        useNewUrlParser : true,
        useUnifiedTopology: true,
    }, (err, res) => {
        if(!err) {
            console.log("*** Conectado a MongoDB ***")
        }
        else {
            console.log(" >>> No se pudo conectar a MongoDB <<<")
        }
    });
};

module.exports = mongoConnect;

// con esto hago la conexión a mongo
// con el process.env estoy entrando en el archivo directamente y llamo la variable que necesite