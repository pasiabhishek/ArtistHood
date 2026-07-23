const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {

    try {

        const {

            firstName,
            lastName,
            email,
            password

        } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {

            return res.status(400).json({

                message: "User already exists"

            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({

            firstName,
            lastName,
            email,
            password: hashedPassword

        });

        res.status(201).json({

            success: true,

            message: "Account Created",

            user

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};