const Blockchain = require("./blockchain/blockchain");
const bitcoin = new Blockchain();

const previousBlockHash = 'hgcjkccdcdbgdkklj';
const currentBlockDetails = [
  {
      amount: 300,
      sender: 'cvdcjvjhcvjcgegwediu',
      recipient: 'fwufgisvisisivvcvvc'
    },
    {
      amount: 500,
      sender: 'vcvcdvcvcjvccvcjhvchj',
      recipient: 'hcvjhcjvcjhcjhckhckknchi'
    },
    {
      amount: 700,
      sender: 'gfgwfyuwewdiuigid',
      recipient: 'gefyefihdgdqdBHMJ'
    },
    {
      amount: 900,
      sender: 'YERROpsbjdfvcvwebfy',
      recipient: 'ieufyygivninbsxqoPjvg'
    }
];

const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockDetails)
// console.log(nonce);


