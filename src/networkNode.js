const express = require('express')
const bodyParser = require('body-parser');
const {getBlockchain, postTransaction, mineNewBlock, registerAndBroadcastNode, registerNode, registerNodeBulk} = require('./blockchain/controllers')

const app = express()
const port = process.argv[2];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('Welcome to blockchain built with javascript')
})

app.get('/blockchain', getBlockchain)

app.post('/transaction', postTransaction)

app.get('/mine', mineNewBlock)

app.post('/register-and-broadcast-node', registerAndBroadcastNode)

app.post('/register-node', registerNode)

app.post('/register-nodes-bulk', registerNodeBulk)


app.listen(port, () => console.log(`Javascript Blockchain is listening on port ${port}`));
