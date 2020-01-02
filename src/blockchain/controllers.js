const uuid = require('uuid/v1');
const Blockchain = require('./blockchain');

const cryptoCoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');


  const getBlockchain = function (req, res) {
    res.send(cryptoCoin)
  }

  const postTransaction = function (req, res) {
    const {amount, sender, recipient} = req.body;
    const blockIndex = cryptoCoin.createNewTransaction(amount, sender, recipient);
    res.status(200).json({
    status: 'Success',
    message:`Transaction will be added in block ${blockIndex}`
    })
  }

  const mineNewBlock = function (req, res) {
    const lastBlock = cryptoCoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockDetails = {
      transaction: cryptoCoin.pendingTransactions,
      index: lastBlock['index'] + 1,
    }
    
    const nonce = cryptoCoin.proofOfWork(previousBlockHash, currentBlockDetails);
    const hash = cryptoCoin.hashBlock(previousBlockHash, currentBlockDetails, nonce);

    // send mining reward to this node's address
    cryptoCoin.createNewTransaction(12.5, '00', nodeAddress)

    const newBlock = cryptoCoin.createNewBlock(nonce, previousBlockHash, hash);
    res.status(200).json({
      status: 'Success',
      message: 'Block mined successfully',
      block: newBlock
    })
  }

module.exports = {getBlockchain, postTransaction, mineNewBlock};
