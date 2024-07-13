import { ethers, network } from "hardhat";

export async function proposeOption(governorAddress: string, boxAddress: string, functionToCall: string, args: any[], proposalDescription: string) {
    const governor = await ethers.getContractAt("GovernorContract",governorAddress);

    const box = await ethers.getContractAt("Box",boxAddress);

    let chainId;
    if(["hardhat","localhost"].includes(network.name)){
        chainId = 31337 // Set chainId to 31337 for Hardhat or localhost
    } else {
        console.log("network config : ",network.config);
        chainId = network.config.chainId || 0;
    }
    console.log(`chain id : ${chainId}`);

    
}

const governorAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const boxAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
const functionToCall = "store";
const args:(string | number)[] = [38];
const proposalDescription = "Proposal #1: Storing 34 in the box!";

proposeOption(governorAddress,boxAddress,functionToCall,args, proposalDescription).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});