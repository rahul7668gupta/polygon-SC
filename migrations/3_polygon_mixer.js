const PolygonMixer = artifacts.require("PolygonMixer");

module.exports = function (deployer) {
  deployer.deploy(PolygonMixer);
};