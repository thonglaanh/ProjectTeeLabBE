const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const colorSchema = new Schema({
    name: String,
    image: String
})

const productSchema = new Schema({
    name: String,
    price: String,
    oldPrice: String,
    sale: String,
    description: String,
    images: Array,
    colors: [colorSchema],
    category: { type: mongoose.Schema.ObjectId, ref: 'categories' }
}, {
    collection: 'products',
    timestamps: true
});
const productModel = mongoose.model('products', productSchema);
module.exports = productModel;