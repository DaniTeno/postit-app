const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; //me faltaba la llave...

const tokenSign = async (user) => {
    const tokenExpires = {expiresIn: "24h"};
    const payload = {
        _id: user.id,
        role: user.role
    };
    const sign = jwt.sign(payload, JWT_SECRET, tokenExpires)
    return sign
};

//el jwt es el token que envía el cliente en su req para ser verificado
const verifyToken = async (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return console.log('Error al verificar JWT');
    }
};

module.exports = { verifyToken, tokenSign };
