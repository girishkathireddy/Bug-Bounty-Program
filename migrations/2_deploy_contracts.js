var Post = artifacts.require("./Post.sol");
module.exports = function(deployer) {
  deployer.deploy(Post,10000, 20000, web3.toWei(0.01, 'ether'));
};
