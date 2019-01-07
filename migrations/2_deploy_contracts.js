var Post = artifacts.require("./Post.sol");
module.exports = function(deployer) {
  deployer.deploy(Post);
};
