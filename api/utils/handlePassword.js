const bcryptjs = require('bcryptjs');

const encrypt = async (password) => {
    const hash = await bcryptjs.hash(password, 10);
    return hash;
};

const passCompare = async (password, hashPass) => {
    return bcryptjs.compare(password, hashPass);
};

module.exports = {encrypt, passCompare}