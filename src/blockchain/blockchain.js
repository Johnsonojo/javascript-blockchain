const sha256 = require('sha256'); 

// using constructor function to build the blockchain
function Blockchain(params) {
  this.chain = [];
  this.pendingTransactions = [];

  // Genesis block
  this.createNewBlock(1150, 'genesis', 'block')

}

// create new block method
Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
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
}

 // Get last block
Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
}

// Creat new transaction
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient
  };
  this.pendingTransactions.push(newTransaction); 
  return this.getLastBlock()['index'] + 1;
}

// hash a block
Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockDetails, nonce ) {
  const stringedHashBlockArgs = previousBlockHash + JSON.stringify(currentBlockDetails) + nonce.toString()

  const hash = sha256(stringedHashBlockArgs);
  return hash 
}

// Proof of Work Algorithm
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockDetails) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockDetails, nonce)
  while (hash.substring(0,4 ) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockDetails, nonce)
    
    // console.log(hash);
  }
  return nonce;
}

module.exports = Blockchain;
