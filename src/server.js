const express = require('express')
const bodyParser = require('body-parser');
const {getBlockchain, postTransaction, mineNewBlock} = require('./blockchain/controllers')


const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('Welcome to blockchain built with javascript')
})

app.get('/blockchain', getBlockchain)

app.post('/transaction', postTransaction)

app.get('/mine', mineNewBlock)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Javascript Blockchain is listening on port ${PORT}`));
