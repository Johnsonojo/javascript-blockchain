const sha256 = require('sha256');
const uuid = require('uuid/v1');
const currentNodeUrl = process.argv[3];

// USING CONSTRUCTOR FUNCTION TO BUILD THE BLOCKCHAIN
function Blockchain(params) {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];

  // Genesis block
  this.createNewBlock(1150, 'genesis', 'block');
}

// CREATE NEW BLOCK METHOD
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

// GET LAST BLOCK METHOD
Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

// CREATE NEW TRANSACTION
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

// ADD NEW TRANSACTIONS TO PENDING TRANSACTION
Blockchain.prototype.addToPendingTransactions = function(transaction) {
  this.pendingTransactions.push(transaction);
  return this.getLastBlock()['index'] + 1;
};

// HASH A BLOCK
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

// PROOF OF WORK ALGORITHM
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

// CHAIN IS VALID METHOD FOR THE CONSENSUS ALGORITHM
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

  // Validate the genesis block properties
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

// GET A SPECIFIC BLOCK ON THE BLOCKCHAIN
Blockchain.prototype.getBlock = function(blockHash) {
  let correctBlock = null;
  this.chain.forEach(block => {
    if (block.hash === blockHash) correctBlock = block;
  });
  return correctBlock;
};

// GET A SPECIFIC TRANSACTION FROM THE BLOCKCHAIN
Blockchain.prototype.getTransaction = function(transactionId) {
  let correctTransaction = null;
  let correctBlock = null;
  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if (transaction.transactionId === transactionId) {
        correctTransaction = transaction;
        correctBlock = block;
      }
    });
  });
  return { transaction: correctTransaction, block: correctBlock };
};

// GET A SPECIFIC ADDRESS FROM THE BLOCKCHAIN
Blockchain.prototype.getAddressData = function(address) {
  const addressTransactions = [];
  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if (transaction.sender === address || transaction.recipient === address) {
        addressTransactions.push(transaction);
      }
    });
  });

  let balance = 0;
  addressTransactions.forEach(transaction => {
    if (transaction.recipient === address) {
      balance += transaction.amount;
    } else if (transaction.sender === address) {
      balance -= transaction.amount;
    }
  });
  return {
    transactions: addressTransactions,
    addressBalance: balance
  };
};

module.exports = Blockchain;
