const { task } = require("hardhat/config")
const { getAccount } = require("../scripts/helper")

task("add-voting", "Adds a new voting")
    .addParam("account2")
    .addParam("account3")
    .setAction(async (taskArgs, hre) => {
        const Voting = await hre.ethers.getContractFactory(
            "Voting",
            getAccount()
        )
        console.log("Deploying contract ...")

        const voting = await Voting.deploy([
            taskArgs.account2,
            taskArgs.account3,
        ])
        await voting.deployed()
        console.log(`Deployed contract to: ${voting.address}`)
    })
