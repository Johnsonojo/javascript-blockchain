# javascript-blockchain

The most basic of blockchain implementation using javascript

## Table of Content

- [Features](#features)
- [Background](#background)
- [Setup](#Setup)
- [Tests](#tests)
- [Endpoints](#endpoints)
- [Authors](#authors)
- [Acknowledgement](#acknowledgement)

## Features

Here are the list of features this blockchain offers:

1. you can get the whole blockchain
2. you can make and broadcast a transaction
3. you can mine a block and get the miner's reward
4. you can receive a new block
5. you can register and broadcast a node
6. you can register nodes in bulk
7. you can perform a consensus on a specific node
8. you can get a specific block hash
9. you can get a specific transaction
10. you can get a specific address and its details

## Background

We will build this application with the following technologies:

- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://en.wikipedia.org/wiki/Express.js)

## Setup

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes:

- Install [NodeJs](https://nodejs.org/en/download/) on your computer.
- Clone the git repository into a directory of your choice using `git clone https://github.com/Johnsonojo/javascript-blockchain.git`
- navigate to the project folder and run `npm install` on the command line to install all dependencies.
- Run the following scripts on different tabs on your terminal to start the various network node `npm run node-1`, `npm run node-2`, `npm run node-3`, `npm run node-4`, and `npm run node-5`.
- Open postman and verify all shortlisted endpoints.

## Tests

- run `npm test` on the command-line to run the test.

## Endpoints

There are five blockchain nodes in this project, any of which can be used to run the server. The node urls are as follows:

- node-1: http://localhost:3001
- node-2: http://localhost:3002
- node-3: http://localhost:3003
- node-4: http://localhost:3004
- node-5: http://localhost:3005

<table>
<tr><th>Http verbs</th><th>Endpoints</th><th>Functionality</th></tr>
<tr><td>GET</td><td>http:localhost:3001/</td><td> Home route of the blockchain</td></tr>
<tr><td>GET</td><td>http:localhost:3001/blockchain</td><td> Get the whole blockchain</td></tr>
<tr><td>POST</td><td>http:localhost:3001/transaction</td><td> Post a transaction</td></tr>
<tr><td>POST</td><td>http:localhost:3001/transaction/broadcast</td><td> Broadcast a transaction to the entire network</td></tr>
<tr><td>GET</td><td>http:localhost:3001/mine</td><td> Mine a block</td></tr>
<tr><td>POST</td><td>http:localhost:3001/receive-new-block</td><td> Enables a node to receive a new block</td></tr>
<tr><td>POST</td><td>http:localhost:3001/register-and-broadcast-node</td><td> Take a registered node and broadcast it to the entire network</td></tr>
<tr><td>POST</td><td> http:localhost:3001/register-node </td><td> Registers a node with the current node</td></tr>
<tr><td>POST</td><td>http:localhost:3001/register-nodes-bulk </td><td> Registers multiple nodes at once</td></tr>
<tr><td>GET</td><td>http:localhost:3001/consensus </td><td> Enables all nodes to have the same blockchain data</td></tr>
<tr><td>GET</td><td>http:localhost:3001/block/:blockHash </td><td> Gets the details of a specific block hash</td></tr>
<tr><td>GET</td><td>http:localhost:3001/transaction/:transactionId </td><td> Gets the details of a specific transaction</td></tr>
<tr><td>GET</td><td>http:localhost:3001/address/:address </td><td> Gets the details of a specific address</td></tr>
</table>

## Authors

Johnson Ojo

## Acknowledgement

[Eric Traub's udemy blockchain course](https://www.udemy.com/course/build-a-blockchain-in-javascript/)

## Note

The frontend of the blockchain is still being worked on.
