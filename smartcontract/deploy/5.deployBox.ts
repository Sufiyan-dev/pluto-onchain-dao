import { ethers } from "hardhat";

export async function deployBox(timeLock:string) {
    const [signer] = await ethers.getSigners();

    const box = await ethers.deployContract("Box");
    await box.waitForDeployment();

    console.log(
        `box deployed to ${box.target}`
    );

    const transferOwnershipTx = await box.transferOwnership(timeLock);
    await transferOwnershipTx.wait(1);

    console.log("transferred ownership to timelock");
}
const timeLock = "";

// deployBox(timeLock).catch((error) => {
//         console.error(error);
//         process.exitCode = 1;
// });