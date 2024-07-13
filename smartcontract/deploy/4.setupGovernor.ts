import { ethers } from "hardhat";
import { deployBox } from "./5.deployBox";

export async function setupGovernance(governance:any, timeLock:any) {

    const [signer] = await ethers.getSigners();

    const governanceContract = await ethers.getContractAt("GovernorContract",governance);
    const timeLockContract = await ethers.getContractAt("TimeLock",timeLock);


    console.log("setting up roles...");
    const proposalRole = await timeLockContract.PROPOSER_ROLE();
    const executorRole = await timeLockContract.EXECUTOR_ROLE();
    const adminRole = await timeLockContract.DEFAULT_ADMIN_ROLE();

    const proposalTx = await timeLockContract.grantRole(proposalRole,governance);
    await proposalTx.wait(1);

    const executorTx = await timeLockContract.grantRole(executorRole,ethers.ZeroAddress);
    await executorTx.wait(1);

    const revokeTx = await timeLockContract.revokeRole(adminRole, signer.address);
    await revokeTx.wait(1);

    await deployBox(timeLock);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });