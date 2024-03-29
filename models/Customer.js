const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: String,
    email: String,
    password: String,
    date: Date,
    phone: String,
    img: String
}, {
    collection: 'customers',
    timestamps: true
});
const customerModel = mongoose.model('customers', customerSchema);
module.exports = customerModel;