const { expect, assert } = require("chai")
const { expectRevert } = require("@openzeppelin/test-helpers")
const { ethers } = require("hardhat")

describe("Voting", () => {
    let accounts
    const comission = ethers.utils.parseEther("0.01")
    beforeEach(async () => {
        accounts = await ethers.getSigners()

        votingFactory = await ethers.getContractFactory("Voting")
        voting = await votingFactory.deploy([
            "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", //candidate 1
            "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", //candidate 2
        ])
    })

    it("Vote function working check", async () => {
        const expectedValue = "2"
        await voting.connect(accounts[3]).vote("0", { value: comission }) // votes candidate in index 0
        await voting.connect(accounts[4]).vote("0", { value: comission }) // votes candidate in index 0
        await voting.connect(accounts[5]).vote("1", { value: comission }) // votes candidate in index 1
        const proposals = await voting.getProposals()
        assert.equal(proposals[0].voteCount.toString(), expectedValue)
    })

    it("Voter can't vote if already voted", async () => {
        await voting.connect(accounts[3]).vote("0", { value: comission }) // votes candidate in index 0
        await expect(
            voting.connect(accounts[3]).vote("0", { value: comission }) // again votes candidate in index 0
        ).to.be.revertedWith("Already voted.")
    })

    it("completeVoting function check", async () => {
        await voting.connect(accounts[3]).vote("0", { value: comission }) // accounts[3] becomes voter
        await voting.connect(accounts[3]).completeVoting() // accounts[3](voter) can close voting
        const proposals = await voting.getProposals()
        const winner = await voting.getWinner()
        console.log(
            `The winner after finishing of Voting is: ${winner._address}`
        )
        assert.equal(proposals[0]._address, winner._address)
    })

    it("Only voters can complete Voting ", async () => {
        await expect(
            voting.connect(accounts[3]).completeVoting()
        ).to.be.revertedWith("You aren't voter")
    })

    it("withdrawCommission function check", async () => {
        await voting.connect(accounts[3]).vote("0", { value: comission })
        await voting.connect(accounts[3]).completeVoting()
        const beforeWithdraw = await accounts[0].getBalance()
        await voting.withdrawCommission() //only owner closes
        const afterWithdraw = await accounts[0].getBalance() //owner comission money
        console.log(
            `The Owner's earning money after withdraw: ${
                afterWithdraw - beforeWithdraw
            }`
        )
    })
    it("Only owners can withdraw commission ", async () => {
        await expect(
            voting.connect(accounts[1]).withdrawCommission() // not owner wants to withdraw money
        ).to.be.revertedWith(
            "You are not owner, and you do not have permissions"
        )
    })
})
