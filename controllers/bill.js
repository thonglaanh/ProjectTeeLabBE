const Cart = require('../models/Cart')
const Customer = require('../models/Customer')
const Bill = require('../models/Bill')
class cartController {
    get(req, res, next) {
        const customer = req.user;
        console.log(customer);

        Bill.find({}).populate('customer').populate('product').then(data => {
            res.status(200).json({ status: 'success', message: 'Get dữ liệu thành công', data });
        }).catch((error) => {
            res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi trong quá trình lấy dữ liệu ' + error });
        })
    }
    create(req, res, next) {
        const formData = req.body;
        formData.customer = req.user;
        console.log(formData);

        Bill.create(formData).then(() => {
            res.status(200).json('Success')
        }).catch((err) => {
            res.status(400).json('Failed')
        })
    }
    delete(req, res, next) {
        const id = req.params._id;
        Bill.findByIdAndDelete(id).then(() => {
            console.log('Delete success');
        }).catch((err) => {
            console.log('Delete failed : ' + err);
        })
        console.log(id);
    }

}
module.exports = new cartController;