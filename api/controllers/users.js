const { usersModels } = require('../models/index')
const { handleHttpError } = require('../utils/handleErrors');
const { tokenSign } = require('../utils/handleJWT');
const {encrypt, passCompare} = require('../utils/handlePassword');

const registerUser = async (req, res) => {
    try {
        if(await usersModels.findOne({email: req.body.email})) {
            return handleHttpError(res, 'ERROR:ALREADY_REGISTERED');
        }
        const passwordHash = await encrypt(req.body.password);
        const body = {...req.body, password: passwordHash};
        const newUserData = await usersModels.create(body);
        const data = {
            token: await tokenSign(newUserData),
            user: newUserData
        };
        return res.send(data);
    } catch (err) {
        handleHttpError(res, 'ERROR:REGISTER_USER');
    }
};

const loginUser= async (req, res) => {
    try {
        const user = await usersModels.findOne({email: req.body.email});
        if(!user) return handleHttpError(res, 'ERROR:USER_NOT_FOUND', 404);
        const hashPass = user.password;
        const check = await passCompare(req.body.password, hashPass);
        if(!check) return handleHttpError(res, 'ERROR:INVALID_PASSWORD', 401);
        const data = {
            token: await tokenSign(user),
            user
        }
        return res.send(data); //aqui puedo mandar solo el data.token para que solo guarde ese dato
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR:LOGIN_USER');
    }
}

module.exports = {registerUser, loginUser}