import { ethers, network } from "hardhat";
import { moveTime } from "../utils/moveTime";
import { moveBlocks } from "../utils/moveBlocks";

async function queueAndExecute(boxAddress: string, governorAddress: string) {
    const MIN_VOTETIME = 3600; // 
    const args = [34]
    const functionToCall = "store";
    const proposalDescription = "Proposal #1: Storing 34 in the box!";

    const box = await ethers.getContractAt("Box",boxAddress);

    // @ts-ignore
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);

    const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes(proposalDescription))
    // could also use ethers.id(PROPOSAL_DESCRIPTION)
  
    const governor = await ethers.getContractAt("GovernorContract",governorAddress);
    console.log("Queueing...")
    const queueTx = await governor.queue([boxAddress], [0], [encodedFunctionCall], descriptionHash)
    await queueTx.wait(1);

    if (["hardhat","localhost"].includes(network.name)) {
        await moveTime(MIN_VOTETIME + 1)
        await moveBlocks(1)
    }

    console.log("Executing...")
    // this will fail on a testnet because you need to wait for the MIN_DELAY!
    const executeTx = await governor.execute(
        [boxAddress],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1);

    console.log(`Box value: ${await box.retrieve()}`)
    
}

const governorAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const boxAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

queueAndExecute(boxAddress,governorAddress).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});