const express = require('express')
const router = express.Router()

router.get('/',(req,res,next)=> {
    res.status(200).json({
        message: 'order GET handled'
    })
})

router.post('/',(req,res,next)=> {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'order created',
        createdOrder: order
    })
})

router.get('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message: 'order fetched',
        id: req.params.orderId
    })
})

module.exports = router