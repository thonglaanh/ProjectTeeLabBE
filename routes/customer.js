const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get('/', controller.get);
router.post('/login', controller.login);
router.post('/register', controller.register)
router.put('/update/:_id', upload.single('img'), controller.update)

module.exports = router;