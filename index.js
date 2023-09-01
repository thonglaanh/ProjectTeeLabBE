require('dotenv').config();
const express = require('express')
const app = express();
const route = require('./routes')
const cors = require('cors');
const db = require('./db/index');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
db.connect();
route(app);
app.listen(PORT, () => {
    console.log('Server started on port : ' + PORT);
})  