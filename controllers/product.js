const Product = require('../models/Product')
const Category = require('../models/Category')
const fetchPageData = require('../untils/crawl')

const totalPages = 4; // Tổng số trang cần lấy dữ liệu
class productController {
    async get(req, res, next) {
        Product.find({}).populate('category').then((product) => {
            res.status(200).json({ status: 'success', message: 'Get dữ liệu thành công' });
        }).catch((error) => {
            res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi trong quá trình lấy dữ liệu ' + error });
        })

    }
    async crawl(req, res, next) {
        try {
            for (let page = 1; page <= totalPages; page++) {
                await fetchPageData(page);
            }
            res.status(200).json({ status: 'success', message: 'Crawl dữ liệu thành công' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi trong quá trình crawl' });
        }
    }

}
module.exports = new productController;