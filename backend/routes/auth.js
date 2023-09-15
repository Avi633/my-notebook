const express = require("express")
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bycript = require("bcryptjs");
var jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");


// secret token
const JWT_SECRET = 'Mynameis@prince25';

// ROUTE 1 : create user using: POST "/api/auth/createUser": no login required
router.post('/createuser', [
    body('name', 'Name must have atleast 3 char').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password must have atleast 5 char').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    // if there are errors return 400 and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // check whether user with this email exist already
    try {
        let user = await User.findOne({ email: req.body.email })

        if (!user) {
            // password hasing using bycriptjs 
            const salt = await bycript.genSalt(10);
            const secPass = await bycript.hash(req.body.password, salt);
            // creating user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });

            const data = {
                user: {
                    id: user.id
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET)
            success = true;
            return res.json({ success, authtoken })

        } else {
            return res.status(400).json({ success, error: "Sorry! user with this email is exist" })
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error!");
    }
})

// ROUTE 2 : Authenticate a user using: POST "/api/auth/login": no login required
router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    // if there are errors return 400 and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // check for valid mail
        let user = await User.findOne({ email })
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: "Please enter valid email!" })
        }

        // compare password 
        const passwordCompare = await bycript.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "Incorrect password!" })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true;
        return res.json({ success, authtoken })

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error!");
    }
})

// ROUTE 3 : Get looged in User details using: POST "/api/auth/getuser": login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password')
        res.send(user)
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error!");
    }
})


module.exports = router;
