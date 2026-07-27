const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Verifies the JWT sent in the Authorization header and attaches the user to req.user
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user (without password) to the request object
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('User not found, authorization denied');
            }

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed or expired');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});

// Restricts a route to specific roles, e.g. authorize('Admin') or authorize('Artist', 'Admin')
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`Role '${req.user.role}' is not permitted to perform this action`);
        }
        next();
    };
};

module.exports = { protect, authorize };
