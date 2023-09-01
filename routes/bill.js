const express = require('express');
const router = express.Router();
const controller = require('../controllers/bill')
const middlerware = require('../middlerware/middleware')
router.get('/', controller.get)
router.delete('/delete/:_id', middlerware, controller.delete)
router.post('/create', middlerware, controller.create)
module.exports = router;