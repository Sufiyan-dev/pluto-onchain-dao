import { ethers } from "hardhat";

export async function TimeLock() {
    const [signer] = await ethers.getSigners();

    const timeLock = await ethers.deployContract("TimeLock",[3600,[],[],signer.address]);

    await timeLock.waitForDeployment();

    console.log(
        `Time lock deployed to ${timeLock.target}`
    );

    return timeLock.target;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// TimeLock().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });