const customerRoute = require('./customer');
const cartRoute = require('./cart');
const productRoute = require('./product');
const billRoute = require('./bill')
function route(app) {
    app.use('/customer', customerRoute);
    app.use('/product', productRoute);
    app.use('/cart', cartRoute);
    app.use('/bill', billRoute);
}
module.exports = route