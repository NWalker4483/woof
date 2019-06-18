//Import Hyperledger Fabric 1.4 programming model - fabric-network
'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');

//connect to the config file
const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
let userName = config.userName;
let gatewayDiscovery = config.gatewayDiscovery;
// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

exports.queryAllCars = async function () {
  try {

    let response = {};

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '/wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(userName);
    if (!userExists) {
      console.log('An identity for the user ' + userName + ' does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
      return response;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('voteChainDemo');

    // Submit the specified transaction.
    response = await contract.evaluateTransaction('queryAll');
    console.log(response);
    console.log('Transaction has been submitted');

    // Disconnect from the gateway.
    await gateway.disconnect();

    response.msg = 'createCar Transaction has been submitted';
    return response;

  } catch (error) {
    let response;
    console.error(`Failed to submit transaction: ${error}`);
    response.error = error.message;
    return response;
  }
};

exports.queryWithQueryString = async function (args) {
  try {

    console.log('args in queryWithQueryString: ');
    console.log(args);
    args = args.toString();

    let response = {};

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '/wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(userName);
    if (!userExists) {
      console.log('An identity for the user ' + userName + ' does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
      return response;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('voteChainDemo');

    // Submit the specified transaction.
    response = await contract.submitTransaction('queryByObjectType', args);
    console.log(response);
    console.log('Transaction has been submitted');

    // Disconnect from the gateway.
    await gateway.disconnect();

    response.msg = 'createCar Transaction has been submitted';
    return response;

  } catch (error) {
    let response;
    console.error(`Failed to submit transaction: ${error}`);
    response.error = error.message;
    return response;
  }
};