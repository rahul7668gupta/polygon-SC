const PolygonJupiter = artifacts.require("PolygonJupiter");
const truffleAssert = require('truffle-assertions');

contract('PolygonJupiter', function (accounts) {
  before(async () => {
    this.polygonJupiterInstance = await PolygonJupiter.deployed();
    this.referral = accounts[9];
  });

  it("owner verified as accounts[0]", async () => {
    const owner = accounts[0];
    const contractOwner = await this.polygonJupiterInstance.owner();
    assert.equal(owner, contractOwner, "Owner is not correct");
  });

  it("depositing 1 MATIC from account [0] for 10 days", async () => {
    const account = accounts[0];
    const amount = web3.utils.toWei("1", "ether");
    const days = 10;
    await this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount });
    const userInfo = await this.polygonJupiterInstance.userInfo(account);
    assert.equal(userInfo.total_invested, amount, "Deposited amount is not correct");
  });

  it("depositing 1 MATIC from account [1] for 34 days", async () => {
    const account = accounts[1];
    const amount = web3.utils.toWei("1", "ether");
    const days = 34;
    await this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount });
    const userInfo = await this.polygonJupiterInstance.userInfo(account);
    assert.equal(userInfo.total_invested, amount, "Deposited amount is not correct");
  });

  it("depositing 1 MATIC from account [2] for 9 days reverted", async () => {
    const account = accounts[1];
    const amount = web3.utils.toWei("1", "ether");
    const days = 9;
    await truffleAssert.reverts(this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount }), "Tarif not found");
  });

  it("depositing 1 MATIC from account [3] for 35 days reverted", async () => {
    const account = accounts[1];
    const amount = web3.utils.toWei("1", "ether");
    const days = 35;
    await truffleAssert.reverts(this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount }), "Tarif not found");
  });

  it("depositing 0.99 MATIC from account [1] for 10 days reverted", async () => {
    const account = accounts[1];
    const amount = web3.utils.toWei("0.99", "ether");
    const days = 10;
    await truffleAssert.reverts(this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount }), "Minimum deposit amount is 1 MATIC");
  });

  it("deposit details verified for accounts[1]", async () => {
    const depositInfo = await this.polygonJupiterInstance.getDepositInfo(0, { from: accounts[1] });
    assert.equal(depositInfo._tarif, 34, "Tarif is not correct");
    assert.equal(depositInfo._amount, web3.utils.toWei("1", "ether"), "Amount is not correct");
  });
});