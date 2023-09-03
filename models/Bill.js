const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const billSchema = new Schema({
    product: { type: mongoose.Schema.ObjectId, ref: 'products' },
    size: String,
    color: String,
    quantity: String,
    address: String,
    customer: { type: mongoose.Schema.ObjectId, ref: 'customers' },
    phone: String

}, {
    collection: 'bills',
    timestamps: true
});
const billModel = mongoose.model('bills', billSchema);
module.exports = billModel;