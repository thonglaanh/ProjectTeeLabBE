const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    product: { type: mongoose.Schema.ObjectId, ref: 'products' },
    size: String,
    color: String,
    quantity: String,
    customer: { type: mongoose.Schema.ObjectId, ref: 'customers' }

}, {
    collection: 'carts',
    timestamps: true
});
const cartModel = mongoose.model('carts', cartSchema);
module.exports = cartModel;