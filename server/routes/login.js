const express = require('express');
const { User } = require('../models');
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require('jsonwebtoken');
const env = require("dotenv")

env.config({ path: "../.env" });
router.post('/', async (req, res) => {
    const { username, password } = req.body
    try {
        const isUserExist = await User.findOne({ where: { username } })
        const salt = await bcrypt.genSalt(10);
        if (!isUserExist) {

            const newUser = await User.create({
                username,
                password,
            })
            newUser.password = await bcrypt.hash(password, salt);
            const user = await newUser.save()
            const payload = {
                user: {
                    id: user.id,
                },
            };
            await jwt.sign(
                payload,
                "process.env.SECRETKEY",
                {
                    expiresIn: 360000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                },
            );
        }
        if (isUserExist) {
            const isMatch = await bcrypt.compare(password, isUserExist.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid Credentials" });
            }
            const payload = {
                user: {
                    id: isUserExist.id,
                },
            };
            await jwt.sign(
                payload,
                "process.env.SECRETKEY",
                {
                    expiresIn: 360000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                },
            );
        }
    } catch (err) {
        throw new Error(err)
    }
})


module.exports = router;
