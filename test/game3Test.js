const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game3", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game3");
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const signer = ethers.provider.getSigner(0);

    // you can get that signer's address via .getAddress()
    // this variable is NOT used for Contract 3, just here as an example
    //const address = await signer.getAddress();

    return { game, signer };
  }

  it("should be a winner", async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);

    // you'll need to update the `balances` mapping to win this stage

    const signer2 = ethers.provider.getSigner(1);
    const signer3 = ethers.provider.getSigner(2);

    const addresses = [signer, signer2, signer3].map(
      async (finalSigner, index) => {
        let finalValue;

        switch (index) {
          case 0:
            finalValue = 2;
            break;
          case 1:
            finalValue = 3;
            break;
          case 2:
            finalValue = 1;
            break;
        }
        // to call a contract as a signer you can use contract.connect
        await game.connect(finalSigner).buy({ value: finalValue });

        return await finalSigner.getAddress();
      }
    );

    // TODO: win expects three arguments
    await game.win(addresses[0], addresses[1], addresses[2]);

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
