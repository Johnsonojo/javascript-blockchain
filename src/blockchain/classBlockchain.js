const sha256 = require('sha256'); 
const currentNodeUrl = process.argv[3];

// Using a class to build the blockchain
class Blockchain {
  constructor() {
    this.chain = [];
    this.newTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
  }

// create new block method
  createNewBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.newTransactions,
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash
    };
  
    this.newTransactions = [];
    this.chain.push(newBlock);
    
    return newBlock;
  } 

  // Get last block
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Creat new transaction
  createNewTransaction(amount, sender, recipient) {
    const newTransaction = {
      amount: amount,
      sender: sender,
      recipient: recipient
    };
    this.pendingTransactions.push(newTransaction); 
    return this.getLastBlock()['index'] + 1;
  }

  // hash a block
  hashBlock(previousBlockHash, currentBlockDetails, nonce) {
  const stringedHashBlockArgs = previousBlockHash + JSON.stringify(currentBlockDetails) + nonce.toString()

  const hash = sha256(stringedHashBlockArgs);
  return hash 
}

// Proof of Work Algorithm
  proofOfWork(previousBlockHash, currentBlockDetails) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockDetails, nonce)
  while (hash.substring(0,4 ) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockDetails, nonce)
    
    // console.log(hash);
  }
  return nonce;
}
}

module.exports = Blockchain;

