const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
                            var refreshToken = getRefeshToken({ _id: data._id });
                            console.log('accessToken', accessToken);
                            console.log('refreshToken', refreshToken);

                            res.cookie('token', accessToken); // Lưu access token vào cookie
                            res.cookie('refreshToken', refreshToken); // Lưu refresh token vào cookie
                            res.cookie('user', data);

                            console.log(data);
                            return res.status(200).json({ status: 'success', data });
                        } else {
                            console.log('hehehe');
                            return res.status(401).json({ status: 'error', message: 'Sai mật khẩu!!' });
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
                                gender: gender

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


}
function getAccessToken(data) {
    const plainData = { ...data, _id: data._id.toString() };
    return jwt.sign(plainData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
}
function getRefeshToken(data) {
    const plainData = { ...data, _id: data._id.toString() };
    return jwt.sign(plainData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
module.exports = new customerController;