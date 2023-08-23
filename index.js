const express = require('express')
const app = express();
app.get('/', (req, res) => {
    res.send('hahaha')
})
app.listen(3000, () => {
    console.log('hehe');
})