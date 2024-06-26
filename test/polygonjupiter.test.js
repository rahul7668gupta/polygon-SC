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

  it("depositing 1 MATIC from accounts[0] for 10 days", async () => {
    const account = accounts[0];
    const amount = web3.utils.toWei("1", "ether");
    const days = 10;
    await this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount });
    const investorInfo = await this.polygonJupiterInstance.investorInfo(account);
    assert.equal(investorInfo.total_invested, amount, "Deposited amount is not correct");
  });

  it("depositing 1 MATIC from accounts[9] for 23 days", async () => {
    const account = accounts[9];
    const amount = web3.utils.toWei("1", "ether");
    const days = 23;
    await this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount });
    const investorInfo = await this.polygonJupiterInstance.investorInfo(account);
    assert.equal(investorInfo.total_invested, amount, "Deposited amount is not correct");
  });

  it("depositing 1 MATIC from accounts[1] for 34 days", async () => {
    const account = accounts[1];
    const amount = web3.utils.toWei("1", "ether");
    const days = 34;
    await this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount });
    const investorInfo = await this.polygonJupiterInstance.investorInfo(account);
    assert.equal(investorInfo.total_invested, amount, "Deposited amount is not correct");
  });

  it("depositing 1 MATIC from accounts[2] for 9 days reverted", async () => {
    const account = accounts[1];
    const amount = web3.utils.toWei("1", "ether");
    const days = 9;
    await truffleAssert.reverts(this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount }), "Tarif not found");
  });

  it("depositing 1 MATIC from accounts[3] for 35 days reverted", async () => {
    const account = accounts[1];
    const amount = web3.utils.toWei("1", "ether");
    const days = 35;
    await truffleAssert.reverts(this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount }), "Tarif not found");
  });

  it("depositing 0.99 MATIC from accounts[1] for 10 days reverted", async () => {
    const account = accounts[1];
    const amount = web3.utils.toWei("0.99", "ether");
    const days = 10;
    await truffleAssert.reverts(this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount }), "Minimum deposit amount is 1 MATIC");
  });

  it("referral for accounts[0] is address(0)", async () => {
    const investorInfo = await this.polygonJupiterInstance.investors(accounts[0]);
    assert.equal(investorInfo.referral, "0x0000000000000000000000000000000000000000", "Referral is not correct");
  });

  it("referral for accounts[1] is accounts[9]", async () => {
    const investorInfo = await this.polygonJupiterInstance.investors(accounts[1]);
    assert.equal(investorInfo.referral, this.referral, "Referral is not correct");
  });

  it("deposit details for accounts[1] for first deposit verified", async () => {
    const depositInfo = await this.polygonJupiterInstance.getDepositInfo(0, { from: accounts[1] });
    assert.equal(depositInfo._tarif, 34, "Tarif is not correct");
    assert.equal(depositInfo._amount, web3.utils.toWei("1", "ether"), "Deposit is not correct");
  })

  it("deposit details for accounts[1] for second deposit reverted", async () => {
    await truffleAssert.reverts(this.polygonJupiterInstance.getDepositInfo(1, { from: accounts[1] }), "Index out of range");
  })

  it("depositing 3 MATIC from accounts[1] for 23 days", async () => {
    const account = accounts[1];
    const amount = web3.utils.toWei("3", "ether");
    const days = 23;
    await this.polygonJupiterInstance.deposit(days, this.referral, { from: account, value: amount });
    const investorInfo = await this.polygonJupiterInstance.investorInfo(account);
    assert.equal(investorInfo.total_invested, web3.utils.toWei("4", "ether"), "Deposited amount is not correct");
  });

  it("deposit details for accounts[1] for second deposit verified", async () => {
    const depositInfo = await this.polygonJupiterInstance.getDepositInfo(1, { from: accounts[1] });
    assert.equal(depositInfo._tarif, 23, "Tarif is not correct");
    assert.equal(depositInfo._amount, web3.utils.toWei("3", "ether"), "Deposit is not correct");
  })

  it("referral amount for accounts[9] verified", async () => {
    const investorInfo = await this.polygonJupiterInstance.investorInfo(this.referral, { from: accounts[9] });
    assert.equal(investorInfo.total_referral_bonus, web3.utils.toWei("0.36", "ether"), "Referral amount is not correct");
  });

  it("depositing 3 MATIC from accounts[4] for 23 days", async () => {
    const account = accounts[4];
    const amount = web3.utils.toWei("3", "ether");
    const days = 23;
    await this.polygonJupiterInstance.deposit(days, accounts[1], { from: account, value: amount });
    const investorInfo = await this.polygonJupiterInstance.investorInfo(account);
    assert.equal(investorInfo.total_invested, web3.utils.toWei("3", "ether"), "Deposited amount is not correct");
  });

  it("referral amount for accounts[1] verified", async () => {
    const investorInfo = await this.polygonJupiterInstance.investorInfo(accounts[1], { from: accounts[1] });
    assert.equal(investorInfo.total_referral_bonus, web3.utils.toWei("0.27", "ether"), "Referral amount is not correct");
  });

  it("referral amount for accounts[9] verified again", async () => {
    const investorInfo = await this.polygonJupiterInstance.investorInfo(this.referral, { from: accounts[1] });
    assert.equal(investorInfo.total_referral_bonus, web3.utils.toWei("0.495", "ether"), "Referral amount is not correct");
  });

  it("checking if anyone can see other people's deposit detials", async () => {
    const investorInfo = await this.polygonJupiterInstance.investors(accounts[1]);
    assert.equal(investorInfo.deposits, undefined, "Deposit info can be seen by anyone");
  });

  it("a new address should not have a referral amount", async () => {
    const investorInfo = await this.polygonJupiterInstance.investorInfo(accounts[5], { from: accounts[5] });
    assert.equal(investorInfo.total_referral_bonus, 0, "Referral amount is not correct");
  });

  it("a new address should have last deposit time as zero", async () => {
    const investorInfo = await this.polygonJupiterInstance.investors(accounts[5]);
    assert.equal(investorInfo.last_payout, 0, "Last deposit is not zero");
  });

  it("checking accounts[9] investorinfo", async () => {
    const investorInfo = await this.polygonJupiterInstance.investorInfo(accounts[9], { from: accounts[9] });
    assert.equal(investorInfo.total_invested, web3.utils.toWei("1", "ether"), "Deposited amount is not correct");
    assert.equal(investorInfo.total_withdrawn, web3.utils.toWei("0", "ether"), "Withdrawn amount is not correct");
    assert.equal(investorInfo.total_referral_bonus, web3.utils.toWei("0.495", "ether"), "Referral amount is not correct");
    const mappedArray = await investorInfo.structure.map(element => {
      return element.toNumber();
    })
    const checkingArray = [1, 1, 0, 0, 0];
    assert.equal(mappedArray.join(","), checkingArray.join(","), "Referral structure is not correct");
    assert(web3.utils.fromWei(investorInfo.for_withdrawal, "ether") >= 0.495, "For withdrawal is not correct");
  });

  it("check withdraw status for account[9]", async () => {
    const withdrawStatus = await this.polygonJupiterInstance.withdrawStatus({ from: accounts[9] });
    console.log(withdrawStatus._lastPayout.toNumber());
  })

});