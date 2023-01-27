const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();
    const firstSigner = await ethers.provider.getSigner(0);

    return { game, firstSigner };
  }
  it("should be a winner", async function () {
    const { game, firstSigner } = await loadFixture(
      deployContractAndSetVariables
    );

    // good luck

    let walletOK = false;

    while (!walletOK) {
      let signer = ethers.Wallet.createRandom().connect(ethers.provider);

      if (signer.address.substring(2, 4) == "00") {
        await firstSigner.sendTransaction({
          to: signer.address,
          value: ethers.utils.parseEther("1.0"),
        });

        await game.connect(signer).win();
        walletOK = true;
      }
    }

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
