import { ethers } from "hardhat";
import { GovernanceToken } from "./1.deployGovernanceToken";
import { TimeLock } from "./2.deployTimeLock";
import { setupGovernance } from "./4.setupGovernor";

async function main() {
    // const governanceToken = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    // const timeLock = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const votingPeriod = 5;
    const votingDelay = 1;
    const quorumPercentage = 4;

    const governanceToken = await GovernanceToken();
    const timeLock = await TimeLock();

    const [signer] = await ethers.getSigners();

    const governor = await ethers.deployContract("GovernorContract",[governanceToken, timeLock, votingDelay, votingPeriod, quorumPercentage]);

    await governor.waitForDeployment();

    console.log(
        `Governor deployed to ${governor.target}`
    );

    await setupGovernance(governor.target,timeLock);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});