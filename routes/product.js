const express = require('express');
const router = express.Router();
const controller = require('../controllers/product')
router.get('/', controller.get);
router.get('/crawl', controller.crawl);
module.exports = router;