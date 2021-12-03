const PolygonJupiter = artifacts.require("PolygonJupiter");

contract('PolygonJupiter', function (accounts) {
  before(async () => {
    this.polygonJupiterInstance = await PolygonJupiter.deployed();
  });
  it("owner verified", async () => {
    const owner = accounts[0];
    const contractOwner = await this.polygonJupiterInstance.owner();
    assert.equal(owner, contractOwner, "Owner is not correct");
  });

  it("depositing from account [0] for 10 days", async () => { });
  it("depositing from account [1] for 34 days", async () => { });
  it("depositing from account [2] for 9 days reverted", async () => { });


});