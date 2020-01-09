const Blockchain = require('./blockchain/blockchain');
const bitcoin = new Blockchain();
const blockchain1 = {
  chain: [
    {
      index: 1,
      timestamp: 1578480622460,
      transactions: [],
      nonce: 1150,
      hash: 'block',
      previousBlockHash: 'genesis'
    },
    {
      index: 2,
      timestamp: 1578481367840,
      transactions: [
        {
          amount: 10,
          sender: 'hhgdybvbvjuxlkjlvnzkl',
          recipient: 'vbfbbdbhvbhbvhgfydgyghddg',
          transactionId: '4a81e200320611eabcf7ad68e8dbadb5'
        },
        {
          amount: 20,
          sender: 'hhgdybvbvjuxlkjlvnzkl',
          recipient: 'vbfbbdbhvbhbvhgfydgyghddg',
          transactionId: '4ed9ca70320611eabcf7ad68e8dbadb5'
        },
        {
          amount: 30,
          sender: 'hhgdybvbvjuxlkjlvnzkl',
          recipient: 'vbfbbdbhvbhbvhgfydgyghddg',
          transactionId: '52223eb0320611eabcf7ad68e8dbadb5'
        }
      ],
      nonce: 7199,
      hash: '000087abaf99a4fbeb59d6d0319d44a8db9f584f16c4f5f5dada19189e14ab0f',
      previousBlockHash: 'block'
    },
    {
      index: 3,
      timestamp: 1578481375229,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'ab5edbc0320411eabcf7ad68e8dbadb5',
          transactionId: '67a8a6c0320611eabcf7ad68e8dbadb5'
        }
      ],
      nonce: 29939,
      hash: '0000f47e05576660de7cc6ebddd4f1fae6c0f314602fcabf93a69094c684fe9d',
      previousBlockHash:
        '000087abaf99a4fbeb59d6d0319d44a8db9f584f16c4f5f5dada19189e14ab0f'
    },
    {
      index: 4,
      timestamp: 1578481409920,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'ab5edbc0320411eabcf7ad68e8dbadb5',
          transactionId: '6c0e98f0320611eabcf7ad68e8dbadb5'
        },
        {
          amount: 40,
          sender: 'hhgdybvbvjuxlkjlvnzkl',
          recipient: 'vbfbbdbhvbhbvhgfydgyghddg',
          transactionId: '72dcb180320611eabcf7ad68e8dbadb5'
        },
        {
          amount: 50,
          sender: 'hhgdybvbvjuxlkjlvnzkl',
          recipient: 'vbfbbdbhvbhbvhgfydgyghddg',
          transactionId: '76b3aa20320611eabcf7ad68e8dbadb5'
        },
        {
          amount: 60,
          sender: 'hhgdybvbvjuxlkjlvnzkl',
          recipient: 'vbfbbdbhvbhbvhgfydgyghddg',
          transactionId: '79b74d30320611eabcf7ad68e8dbadb5'
        },
        {
          amount: 70,
          sender: 'hhgdybvbvjuxlkjlvnzkl',
          recipient: 'vbfbbdbhvbhbvhgfydgyghddg',
          transactionId: '7d426fc0320611eabcf7ad68e8dbadb5'
        }
      ],
      nonce: 24708,
      hash: '00004c72bf28d8af1304b867728d53a82534786075951db541ee704e2eca8b2e',
      previousBlockHash:
        '0000f47e05576660de7cc6ebddd4f1fae6c0f314602fcabf93a69094c684fe9d'
    },
    {
      index: 5,
      timestamp: 1578481414591,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'ab5edbc0320411eabcf7ad68e8dbadb5',
          transactionId: '80bc2d30320611eabcf7ad68e8dbadb5'
        }
      ],
      nonce: 84416,
      hash: '0000883b8403c7dc7239b51925833eb149a071849bba2b7794986719eb2794ed',
      previousBlockHash:
        '00004c72bf28d8af1304b867728d53a82534786075951db541ee704e2eca8b2e'
    }
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: '00',
      recipient: 'ab5edbc0320411eabcf7ad68e8dbadb5',
      transactionId: '8384c310320611eabcf7ad68e8dbadb5'
    }
  ],
  currentNodeUrl: 'http://localhost:3001',
  networkNodes: []
};
console.log(bitcoin.chainIsValid(blockchain1.chain));
// const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockDetails);
// console.log(nonce);
