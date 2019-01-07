// Allows us to use ES6 in our migrations and tests.
require('babel-register')
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "retire picnic run spider net border foam crucial coil target gossip pony"

// First address generated by this mnemonic is 0x957DE1b171bDf4246457E4305543BCB582F5fd33

module.exports = {
  networks: {
    "ropsten": {
      network_id: 3,    // Official ropsten network id
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/JtZndBkY7B444nvmQGVK ")
      },
      gas: 4700000
    },
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 6600000
    }
  },
  rpc: {
    // Use the default host and port when not using ropsten
    host: "localhost",
    port: 8545
  }
};
