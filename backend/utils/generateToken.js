const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // process.env.JWT_SECRET hi aapke .env file se key uthata hai
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token 30 din me expire hoga
    });
};

module.exports = generateToken;