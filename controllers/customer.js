const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
class customerController {
    get(req, res, next) {
        Customer.find({}).then((customer) => {
            res.json(customer)
        })
    }

    login(req, res, next) {
        console.log(req.body);
        var { email, password } = req.body;
        Customer.findOne({ email: email })
            .then((data) => {
                if (!data) {
                    return res.status(401).json({ status: 'error', message: 'Tài khoản chưa tồn tại' });
                }
                console.log(data);
                // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa
                bcrypt.compare(password, data.password)
                    .then(isMatch => {
                        if (isMatch) {
                            var accessToken = getAccessToken({ _id: data._id });
                            console.log('accessToken', accessToken);
                            console.log(data);
                            return res.status(200).json({ status: 'success', data: { account: data, token: accessToken } });
                        } else {
                            console.log('hehehe');
                            return res.status(402).json({ status: 'error', message: 'Sai mật khẩu!!' });
                        }
                    })
                    .catch(error => {
                        // Xử lý lỗi so sánh mật khẩu
                        return res.status(501).json({ status: 'error', message: 'Đã xảy ra lỗi' });
                    });

            })
            .catch((err) => {
                return res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi' });
            });
    }
    register(req, res, next) {
        var { name, email, password, date, gender } = req.body;
        console.log(req);

        Customer.findOne({ email: email })
            .then((data) => {
                if (data) {
                    res.status(400).json('Email đã tồn tại!');
                } else {
                    bcrypt.genSalt(10)
                        .then(salt => {
                            return bcrypt.hash(password, salt);
                        })
                        .then(hash => {
                            password = hash; // Gán mật khẩu đã được mã hóa vào formData
                            Customer.create({
                                name: name,
                                password: password,
                                email: email,
                                date: date,
                                img: 'https://ionicframework.com/docs/img/demos/avatar.svg'

                            })
                                .then(() => {
                                    return res.status(200).json({ status: 'success', message: 'Thành công' });

                                })
                                .catch((err) => {
                                    return res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi tạo thất bại' + err });

                                });
                        })
                        .catch((err) => {
                            return res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi mã hóa mật khẩu:' + err });

                        });

                }
            })
            .catch((err) => {
                res.status(500).json('Lỗi trong quá trình kiểm tra email : ' + err);
            });
    }
    async update(req, res, next) {
        const formData = req.body;
        const id = req.params._id;
        console.log(formData);
        if (req.file) {
            fs.rename(req.file.path, 'uploads/' + req.file.originalname, function (err) {
                console.log(req.file.originalname);
            });
            formData.img = 'http://localhost:4000/uploads/' + req.file.originalname;
        } else {
            console.log('Không có ảnh');
        }
        Customer.findByIdAndUpdate(id, formData, { new: true }).then((customer) => {
            console.log(customer);

            return res.status(200).json({ status: 'success', data: { account: customer } });
        }).catch((err) => {
            res.json('Update thất bại ' + err)
        })

    }


}
function getAccessToken(data) {
    const plainData = { ...data, _id: data._id.toString() };
    return jwt.sign(plainData, process.env.ACCESS_TOKEN_SECRET);
}
module.exports = new customerController;