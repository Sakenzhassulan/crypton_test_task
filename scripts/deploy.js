const { ethers, run, network } = require("hardhat")
const { getAccount } = require("./helper")

async function main() {
    // const provider = new ethers.providers.JsonRpcProvider()
    const Voting = await ethers.getContractFactory("Voting", getAccount())
    console.log("Deploying contract ...")
    const account2 = "account address"
    const account3 = "account address"
    const voting = await Voting.deploy([account2, account3])
    await voting.deployed()
    console.log(`Deployed contract to: ${voting.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
