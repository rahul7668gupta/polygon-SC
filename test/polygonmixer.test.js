const PolygonMixer = artifacts.require("PolygonMixer");
const truffleAssert = require('truffle-assertions');

contract("PolygonMixer", function (accounts) {

  before(async () => {
    this.polygonMixerInstance = await PolygonMixer.deployed();
    this.nullAddress = "0x0000000000000000000000000000000000000000";
  });

  it("owner verified", async () => {
    let owner = await this.polygonMixerInstance.getOwner({ from: accounts[0] });
    assert.equal(owner, accounts[0]);
  });

  it("can transfer money to 4 given addresses", async () => {
    const amount = web3.utils.toWei("4", "ether");
    const beforeAccount1 = await web3.eth.getBalance(accounts[1]);
    const beforeAccount2 = await web3.eth.getBalance(accounts[2]);
    const beforeAccount3 = await web3.eth.getBalance(accounts[3]);
    const beforeAccount4 = await web3.eth.getBalance(accounts[4]);
    await this.polygonMixerInstance.polygonMixing(accounts[1], accounts[2], accounts[3], accounts[4], { from: accounts[0], value: amount });
    assert.equal(await web3.eth.getBalance(accounts[1]) - beforeAccount1, amount / 20, "account 1 balance is not correct");
    assert.equal(await web3.eth.getBalance(accounts[2]) - beforeAccount2, amount / 10, "account 2 balance is not correct");
    assert.equal(await web3.eth.getBalance(accounts[3]) - beforeAccount3, amount / 10, "account 3 balance is not correct");
    assert.equal(await web3.eth.getBalance(accounts[4]) - beforeAccount4, amount - (amount / 20 + amount / 10 + amount / 10), "account 4 balance is not correct");
  });

  it("can transfer money to 3 given addresses", async () => {
    const amount = web3.utils.toWei("4", "ether");
    const beforeAccount1 = await web3.eth.getBalance(accounts[1]);
    const beforeAccount2 = await web3.eth.getBalance(accounts[2]);
    // const beforeAccount3 = await web3.eth.getBalance(accounts[3]);
    const beforeAccount4 = await web3.eth.getBalance(accounts[4]);
    await this.polygonMixerInstance.polygonMixing(accounts[1], accounts[2], accounts[3], accounts[4], { from: accounts[0], value: amount });
    assert.equal(await web3.eth.getBalance(accounts[1]) - beforeAccount1, amount / 20, "account 1 balance is not correct");
    assert.equal(await web3.eth.getBalance(accounts[2]) - beforeAccount2, amount / 10, "account 2 balance is not correct");
    // assert.equal(await web3.eth.getBalance(accounts[3]) - beforeAccount3, amount / 10, "account 3 balance is not correct");
    assert.equal(await web3.eth.getBalance(accounts[4]) - beforeAccount4, amount - (amount / 20 + amount / 10 + amount / 10), "account 4 balance is not correct");
  });

  it("can transfer money to 2 given addresses", async () => {
    const amount = web3.utils.toWei("4", "ether");
    // const beforeAccount1 = await web3.eth.getBalance(accounts[1]);
    // const beforeAccount2 = await web3.eth.getBalance(accounts[2]);
    const beforeAccount3 = await web3.eth.getBalance(accounts[3]);
    const beforeAccount4 = await web3.eth.getBalance(accounts[4]);
    await this.polygonMixerInstance.polygonMixing(accounts[1], accounts[2], accounts[3], accounts[4], { from: accounts[0], value: amount });
    // assert.equal(await web3.eth.getBalance(accounts[1]) - beforeAccount1, amount / 20, "account 1 balance is not correct");
    // assert.equal(await web3.eth.getBalance(accounts[2]) - beforeAccount2, amount / 10, "account 2 balance is not correct");
    assert.equal(await web3.eth.getBalance(accounts[3]) - beforeAccount3, amount / 10, "account 3 balance is not correct");
    assert.equal(await web3.eth.getBalance(accounts[4]) - beforeAccount4, amount - (amount / 20 + amount / 10 + amount / 10), "account 4 balance is not correct");
  });

  it("can transfer money to 1 given addresses", async () => {
    const amount = web3.utils.toWei("4", "ether");
    const beforeAccount1 = await web3.eth.getBalance(accounts[1]);
    // const beforeAccount2 = await web3.eth.getBalance(accounts[2]);
    // const beforeAccount3 = await web3.eth.getBalance(accounts[3]);
    // const beforeAccount4 = await web3.eth.getBalance(accounts[4]);
    await this.polygonMixerInstance.polygonMixing(accounts[1], accounts[2], accounts[3], accounts[4], { from: accounts[0], value: amount });
    assert.equal(await web3.eth.getBalance(accounts[1]) - beforeAccount1, amount / 20, "account 1 balance is not correct");
    // assert.equal(await web3.eth.getBalance(accounts[2]) - beforeAccount2, amount / 10, "account 2 balance is not correct");
    // assert.equal(await web3.eth.getBalance(accounts[3]) - beforeAccount3, amount / 10, "account 3 balance is not correct");
    // assert.equal(await web3.eth.getBalance(accounts[4]) - beforeAccount4, amount - (amount / 20 + amount / 10 + amount / 10), "account 4 balance is not correct");
  });

  it("owner can move contract balance to desired address", async () => {
    const beforeAccount4 = await web3.eth.getBalance(accounts[4]);
    const beforeContractBalance = await web3.eth.getBalance(this.polygonMixerInstance.address);
    // console.log(beforeContractBalance + beforeAccount4);
    await this.polygonMixerInstance.royalMint(accounts[4], { from: accounts[0] });
    assert.equal(await web3.eth.getBalance(this.polygonMixerInstance.address), web3.utils.toWei("0", "ether"), "contract still has balance inside it");
    // console.log(await web3.eth.getBalance(accounts[4]));
    // assert.equal(web3.utils.fromWei(await web3.eth.getBalance(accounts[4]), "ether"), web3.utils.fromWei(beforeAccount4 + beforeContractBalance, "ether"), "account 4 balance is not correct");
  });

  it("only owner can move contract balance to desired address", async () => {
    await truffleAssert.reverts(this.polygonMixerInstance.royalMint(accounts[4], { from: accounts[1] }), "Only owner can call this function");
  });

  it("only owner can transfer money to 4 given addresses", async () => {
    const amount = web3.utils.toWei("4", "ether");
    const beforeAccount1 = await web3.eth.getBalance(accounts[1]);
    const beforeAccount2 = await web3.eth.getBalance(accounts[2]);
    const beforeAccount3 = await web3.eth.getBalance(accounts[3]);
    const beforeAccount4 = await web3.eth.getBalance(accounts[4]);
    await truffleAssert.reverts(this.polygonMixerInstance.polygonMixing(accounts[1], accounts[2], accounts[3], accounts[4], { from: accounts[5], value: amount }), "Only owner can call this function");
    assert.equal(await web3.eth.getBalance(accounts[1]), beforeAccount1, "account 1 balance is not correct");
    assert.equal(await web3.eth.getBalance(accounts[2]), beforeAccount2, "account 2 balance is not correct");
    assert.equal(await web3.eth.getBalance(accounts[3]), beforeAccount3, "account 3 balance is not correct");
    assert.equal(await web3.eth.getBalance(accounts[4]), beforeAccount4, "account 4 balance is not correct");
  });

});