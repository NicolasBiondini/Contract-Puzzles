const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game4", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game4");
    const game = await Game.deploy();

    return { game };
  }
  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}

    const xSigner = ethers.provider.getSigner(0);
    const ySigner = ethers.provider.getSigner(1);

    const x = await xSigner.getAddress();
    const y = await ySigner.getAddress();

    await game.connect(ySigner).write(x);

    await game.connect(xSigner).win(y);

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
