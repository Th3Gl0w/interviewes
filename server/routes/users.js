const express = require("express");
const router = express.Router();
const { User, Order } = require('../models/')

const auth = require('../middleware/authmiddleware')

router.get('/', async (req, res) => {

    const allUsers = await User.findAll({include : 'orders'})
    res.json(allUsers)
})

router.get('/my_orders', auth, async (req, res) => {
    console.log(req.user)
    const { id } = req.user
    const userOrders = await User.findOne({ where: { id }, include: 'orders' })
    res.json(userOrders)
})
module.exports = router