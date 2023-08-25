const customerRoute = require('./customer');
const cartRoute = require('./cart');
const productRoute = require('./product');
function route(app) {
    app.use('/customer', customerRoute);
    app.use('/product', productRoute);
    app.use('/cart', cartRoute);
}
module.exports = route