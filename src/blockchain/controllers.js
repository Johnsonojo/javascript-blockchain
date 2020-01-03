const uuid = require('uuid/v1');
const rp = require('request-promise');
const Blockchain = require('./blockchain');

const cryptoCoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');

  // Get the whole blockchain 
  const getBlockchain = function (req, res) {
    res.send(cryptoCoin)
  }

  // Post a transaction
  const postTransaction = function (req, res) {
    const {amount, sender, recipient} = req.body;
    const blockIndex = cryptoCoin.createNewTransaction(amount, sender, recipient);
    res.status(200).json({
    status: 'Success',
    message:`Transaction will be added in block ${blockIndex}`
    })
  }

  // Mine a new block
  const mineNewBlock = function (req, res) {
    const lastBlock = cryptoCoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockDetails = {
      transaction: cryptoCoin.pendingTransactions,
      index: lastBlock['index'] + 1,
    }
    
    const nonce = cryptoCoin.proofOfWork(previousBlockHash, currentBlockDetails);
    const hash = cryptoCoin.hashBlock(previousBlockHash, currentBlockDetails, nonce);

    // Send mining reward to this node's address
    cryptoCoin.createNewTransaction(12.5, '00', nodeAddress)

    const newBlock = cryptoCoin.createNewBlock(nonce, previousBlockHash, hash);
    res.status(200).json({
      status: 'Success',
      message: 'Block mined successfully',
      block: newBlock
    });
  }

  //  Register and broadcast a node to the entire network
  const registerAndBroadcastNode = function (req, res) {
    const {newNodeUrl} = req.body;
    if (cryptoCoin.networkNodes.indexOf(newNodeUrl) == -1)cryptoCoin.networkNodes.push(newNodeUrl);

    const registeredNodePromises = [];

    // broadcast the node url
    cryptoCoin.networkNodes.forEach(networkNodeUrl => {
      // hit the /register-node endpoint
      const requestOptions = {
        uri: networkNodeUrl + '/register-node',
        method: 'POST',
        body: {newNodeUrl: newNodeUrl},
        json: true
      };
      registeredNodePromises.push(rp(requestOptions));
    })

    Promise.all(registeredNodePromises)
    .then(data => {
      const bulkRegisterOption = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: {allNetworkNodes: [...cryptoCoin.networkNodes, cryptoCoin.currentNodeUrl]},
        json: true
      };
      return rp(bulkRegisterOption);
    })
    .then(data => {
      res.status(200).json({
        status: 'Success',
        message: 'Node successfully registered with the network'
      })
    })
  }

  // Register a node with the network
  const registerNode = function (req, res) {
    const {newNodeUrl} = req.body;
    const nodeAbsent = cryptoCoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = cryptoCoin.currentNodeUrl !== newNodeUrl; 
    // Register new node url with this current node
    if (nodeAbsent && notCurrentNode) cryptoCoin.networkNodes.push(newNodeUrl);
    res.status(200).json({
      status: 'Success',
      message: 'New node registered with current node successfully'
    })
  }

  // Register multiple nodes at once
  const registerNodeBulk = function (req, res) {
    const {allNetworkNodes} = req.body;
    allNetworkNodes.forEach(networkNodeUrl => {
      const nodeAbsent = cryptoCoin.networkNodes.indexOf(networkNodeUrl) == -1;
      const notCurrentNode = cryptoCoin.currentNodeUrl !== networkNodeUrl; 

      if (nodeAbsent && notCurrentNode) cryptoCoin.networkNodes.push(networkNodeUrl);
    });
    res.status(200).json({
      status: 'Success',
      message: 'Bulk node registration successful'
    })
  }

module.exports = {getBlockchain, postTransaction, mineNewBlock, registerAndBroadcastNode, registerNode, registerNodeBulk};
