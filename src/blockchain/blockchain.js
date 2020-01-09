const sha256 = require('sha256');
const uuid = require('uuid/v1');
const currentNodeUrl = process.argv[3];

// using constructor function to build the blockchain
function Blockchain(params) {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];

  // Genesis block
  this.createNewBlock(1150, 'genesis', 'block');
}

// create new block method
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

// Get last block
Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

// Creat new transaction
Blockchain.prototype.createNewTransaction = function(
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionId: uuid()
      .split('-')
      .join('')
  };
  return newTransaction;
};

// Add new transaction to pending transactions
Blockchain.prototype.addToPendingTransactions = function(transaction) {
  this.pendingTransactions.push(transaction);
  return this.getLastBlock()['index'] + 1;
};

// hash a block
Blockchain.prototype.hashBlock = function(
  previousBlockHash,
  currentBlockDetails,
  nonce
) {
  const stringedHashBlockArgs =
    previousBlockHash + JSON.stringify(currentBlockDetails) + nonce.toString();

  const hash = sha256(stringedHashBlockArgs);
  return hash;
};

// Proof of Work Algorithm
Blockchain.prototype.proofOfWork = function(
  previousBlockHash,
  currentBlockDetails
) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockDetails, nonce);
  while (hash.substring(0, 4) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockDetails, nonce);

    // console.log(hash);
  }
  return nonce;
};

// Chain is valid method fro the consensus algorithm
Blockchain.prototype.chainIsValid = function(blockchain) {
  let validChain = true;

  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];
    const currentBlockDetails = {
      transactions: currentBlock['transactions'],
      index: currentBlock['index']
    };
    // validate every block in the chain to see if they have the correct data
    const blockHash = this.hashBlock(
      previousBlock['hash'],
      currentBlockDetails,
      currentBlock['nonce']
    );
    if (blockHash.substring(0, 4) !== '0000') {
      validChain = false;
    }
    if (currentBlock['previousBlockHash'] !== previousBlock['hash']) {
      validChain = false;
    }
  }

  // check the genesis block properties
  const genesisBlock = blockchain[0];
  const correctNonce = genesisBlock['nonce'] === 1150;
  const correctPreviousBlockHash =
    genesisBlock['previousBlockHash'] === 'genesis';
  const correctHash = genesisBlock['hash'] === 'block';
  const correctTransactions = genesisBlock['transactions'].length === 0;

  if (
    !correctNonce ||
    !correctPreviousBlockHash ||
    !correctHash ||
    !correctTransactions
  ) {
    validChain = false;
  }

  return validChain;
};

module.exports = Blockchain;
