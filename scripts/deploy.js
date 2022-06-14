const { ethers, run, network } = require("hardhat")
const { getAccount } = require("./helper")

async function main() {
    // const provider = new ethers.providers.JsonRpcProvider()
    const Voting = await ethers.getContractFactory("Voting", getAccount())
    console.log("Deploying contract ...")
    const account2 = "0xef82de82a9cea90fc80cfa5dbee2607318c28c37"
    const account3 = "0xa7DaFf92b9d309Deda68385F930DE30d9eE12231"
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
