const { handleHttpError } = require('../utils/handleErrors');
const { verifyToken } = require('../utils/handleJWT');

const authToken = async (req, res, next) => {
    try {
        if(!req.headers.authorization) return handleHttpError(res, "ERROR:NOT_TOKEN", 403);
        const token = req.headers.authorization; // esto trae consigo la palabra Bearer + el token
        const dataToken = await verifyToken(token);
        if(!dataToken._id) return handleHttpError(res, "ERROR:ID_NOT_FOUND", 401);
        next();
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR:NOT_SESSION", 401);
    }
}

module.exports = authToken;