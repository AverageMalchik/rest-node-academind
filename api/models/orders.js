const mongoose = require('mongoose')

const orderSchhema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productId: {type: mongoose.Schema.Types.ObjectId , ref: 'Product', required: true},
    quantity: {type: Number,default:1}
});

module.exports = mongoose.model('Order',orderSchhema);