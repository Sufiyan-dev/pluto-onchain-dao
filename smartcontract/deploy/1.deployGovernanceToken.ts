import { ethers } from "hardhat";

export async function GovernanceToken() {
    const [signer] = await ethers.getSigners();

    const governanceToken = await ethers.deployContract("GovernanceToken");

    await governanceToken.waitForDeployment();

    console.log(
        `Governance Token deployed to ${governanceToken.target}`
    );

    await delegate(governanceToken.target as string,signer.address);
    console.log("Delegated!")

    return governanceToken.target;
}

async function delegate(token:string, delegateTo:string) {
    const governanceToken = await ethers.getContractAt('GovernanceToken',token);

    const tx = await governanceToken.delegate(delegateTo);
    await tx.wait(1);

    console.log(`Checkpoints ${await governanceToken.numCheckpoints(delegateTo)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// GovernanceToken().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });