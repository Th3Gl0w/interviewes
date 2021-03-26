const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const { Order } = require('../models')
const expiration = require('../utils/dates')

router.get('/', auth, async (req, res) => {
    const allOrders = await Order.findAll({ include: 'user' });
    res.json(allOrders);
});

router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const singleOrder = await Order.findOne({
        where: {
            id
        }
    });
    res.json(singleOrder);
})

router.post('/', auth, async (req, res) => {
    const { price } = req.body
    console.log(req.user)

    const dateExpiration = expiration()
    console.log(typeof dateExpiration)
    const newOrder = await Order.create({
        price,
        userId: req.user.id,
        expirationDate: dateExpiration
    })
    newOrder.save()
    res.json({
        message: 'Order has been successfully created'
    })
})

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params
    const { price } = req.body
    console.log(req.user.id)
    let order = await Order.findOne({
        where: {
            id
        }
    })
    console.log(typeof order.userId, typeof req.user.id)
    if (!order) return res.status(400).json({ msg: "Order Not Found" });
    if (order.userId !== req.user.id) return res.status(401).json({ msg: "Not Authorized" });

    try {
        await Order.update({
            price,
        },
            {
                where: {
                    id: id,
                }
            })

    } catch (err) {
        throw new Error(err)
    }
    res.json({
        message: "Order has been sucessfully updated"
    })
})


module.exports = router