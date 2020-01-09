const uuid = require('uuid/v1');
const rp = require('request-promise');
const Blockchain = require('./blockchain');

const cryptoCoin = new Blockchain();
const nodeAddress = uuid()
  .split('-')
  .join('');

// GET THE WHOLE BLOCKCHAIN
const getBlockchain = function(req, res) {
  res.send(cryptoCoin);
};

// POST A NEW TRANSACTION
const postTransaction = function(req, res) {
  const newTransaction = req.body;
  // Add new transaction to pending transactions array
  const blockIndex = cryptoCoin.addToPendingTransactions(newTransaction);
  res.status(200).json({
    status: 'Success',
    message: `Transaction will be added in block ${blockIndex}.`
  });
};

// BROADCAST A NEW TRANSACTION
const broadcastTransaction = function(req, res) {
  const { amount, sender, recipient } = req.body;
  const newTransaction = cryptoCoin.createNewTransaction(
    amount,
    sender,
    recipient
  );
  // add new transaction to pending transaction on this node
  cryptoCoin.addToPendingTransactions(newTransaction);

  const transactionRequestPromises = [];
  // broadcast new transaction to other nodes on the network
  cryptoCoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true
    };
    transactionRequestPromises.push(rp(requestOptions));
  });

  Promise.all(transactionRequestPromises).then(data => {
    res.status(200).json({
      status: 'Success',
      message:
        'Transaction successfully created nad broadcast to entire network'
    });
  });
};

// MINE A NEW BLOCK
const mineNewBlock = function(req, res) {
  const lastBlock = cryptoCoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockDetails = {
    transactions: cryptoCoin.pendingTransactions,
    index: lastBlock['index'] + 1
  };

  const nonce = cryptoCoin.proofOfWork(previousBlockHash, currentBlockDetails);
  const hash = cryptoCoin.hashBlock(
    previousBlockHash,
    currentBlockDetails,
    nonce
  );
  const newBlock = cryptoCoin.createNewBlock(nonce, previousBlockHash, hash);

  const newBlockRequestPromises = [];
  cryptoCoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: { newBlock: newBlock },
      json: true
    };
    newBlockRequestPromises.push(rp(requestOptions));
  });

  Promise.all(newBlockRequestPromises)
    .then(data => {
      // Send mining reward to this node's address
      const requestOptions = {
        uri: cryptoCoin.currentNodeUrl + '/transaction/broadcast',
        method: 'POST',
        body: {
          amount: 12.5,
          sender: '00',
          recipient: nodeAddress
        },
        json: true
      };
      return rp(requestOptions);
    })
    .then(data => {
      res.status(200).json({
        status: 'Success',
        message: 'Block mined successfully',
        block: newBlock
      });
    });
};

// RECEIVE NEW BLOCK
const receiveNewBlock = function(req, res) {
  const { newBlock } = req.body;
  // Validate new block
  const lastBlock = cryptoCoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
  if (correctHash && correctIndex) {
    cryptoCoin.chain.push(newBlock);
    cryptoCoin.pendingTransactions = [];
    res.status(200).json({
      status: 'Success',
      message: 'New block received and added to blockchain successfully',
      newBlock: newBlock
    });
  } else {
    res.status(400).json({
      status: 'Failed',
      message: 'New block was rejected',
      newBlock: newBlock
    });
  }
};

//  REGISTER AND BROADCAST A NODE TO THE ENTIRE NETWORK
const registerAndBroadcastNode = function(req, res) {
  const { newNodeUrl } = req.body;
  if (cryptoCoin.networkNodes.indexOf(newNodeUrl) == -1)
    cryptoCoin.networkNodes.push(newNodeUrl);
  const registeredNodePromises = [];
  // broadcast the node url
  cryptoCoin.networkNodes.forEach(networkNodeUrl => {
    // hit the /register-node endpoint
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true
    };
    registeredNodePromises.push(rp(requestOptions));
  });

  Promise.all(registeredNodePromises)
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: {
          allNetworkNodes: [
            ...cryptoCoin.networkNodes,
            cryptoCoin.currentNodeUrl
          ]
        },
        json: true
      };
      return rp(bulkRegisterOptions);
    })
    .then(data => {
      res.status(200).json({
        status: 'Success',
        message: 'Node successfully registered with the network'
      });
    });
};

// REGISTER A NODE WITH THE NETWORK
const registerNode = function(req, res) {
  const { newNodeUrl } = req.body;
  const nodeAbsent = cryptoCoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = cryptoCoin.currentNodeUrl !== newNodeUrl;
  // Register new node url with this current node
  if (nodeAbsent && notCurrentNode) cryptoCoin.networkNodes.push(newNodeUrl);
  res.status(200).json({
    status: 'Success',
    message: 'New node registered with current node successfully'
  });
};

// REGISTER MULTIPLE NODES AT ONCE
const registerNodeBulk = function(req, res) {
  const { allNetworkNodes } = req.body;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeAbsent = cryptoCoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = cryptoCoin.currentNodeUrl !== networkNodeUrl;

    if (nodeAbsent && notCurrentNode)
      cryptoCoin.networkNodes.push(networkNodeUrl);
  });
  res.status(200).json({
    status: 'Success',
    message: 'Bulk node registration successful'
  });
};

const getConsensus = function(req, res) {
  const getConsensusPromises = [];
  cryptoCoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true
    };

    getConsensusPromises.push(rp(requestOptions));
  });

  Promise.all(getConsensusPromises).then(blockchains => {
    const currentChainLength = cryptoCoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(blockchain => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !cryptoCoin.chainIsValid(newLongestChain))
    ) {
      res.status(200).json({
        status: 'Success',
        message: 'Current chain has not been replaced',
        chain: cryptoCoin.chain
      });
    } else {
      cryptoCoin.chain = newLongestChain;
      cryptoCoin.pendingTransactions = newPendingTransactions;
      res.status(200).json({
        status: 'Success',
        message: 'This chain has been replaced by longest chain',
        chain: cryptoCoin.chain
      });
    }
  });
};

module.exports = {
  getBlockchain,
  postTransaction,
  broadcastTransaction,
  mineNewBlock,
  receiveNewBlock,
  registerAndBroadcastNode,
  registerNode,
  registerNodeBulk,
  getConsensus
};
