const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const billSchema = new Schema({
    cart: { type: mongoose.Schema.ObjectId, ref: 'carts' },
    address: String,
    customer: { type: mongoose.Schema.ObjectId, ref: 'customers' }

}, {
    collection: 'bills',
    timestamps: true
});
const billModel = mongoose.model('bills', billSchema);
module.exports = billModel;