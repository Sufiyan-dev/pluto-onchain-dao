import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/moveBlocks";
import fs from 'fs';
import path from 'path';
// Path to the JSON file
const FILE_PATH = path.join(__dirname, 'proposals.json');

export async function propose(governorAddress: string, boxAddress: string, functionToCall: string, args: any[], proposalDescription: string) {
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
    
    // @ts-ignore
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);
    console.log("encode ", encodedFunctionCall);

    console.log(`Proposing ${functionToCall} on ${boxAddress} with ${args}`);
    console.log(`Proposal description : \n ${proposalDescription}`);

    const proposeTx = await governor.propose(
        [boxAddress],
        [0],
        [encodedFunctionCall],
        proposalDescription
    );
    const proposalReceipt = await proposeTx.wait(1);
    const votingDelay = 1;

    if(["hardhat","localhost"].includes(network.name)){
        moveBlocks(votingDelay + 1);
    }
    const logs = proposalReceipt?.logs || [];

    // Find the proposalId from logs
    let proposalId;
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      try {
        const parsedLog = governor.interface.parseLog(log);
        if (parsedLog?.name === "ProposalCreated") { // Adjust based on your event name
          proposalId = parsedLog.args.proposalId;
          break;
        }
      } catch (error) {
        console.error('Error parsing log:', error);
      }
    }

    if (!proposalId) {
      throw new Error('Proposal ID not found in logs');
    }

    console.log('Proposal ID:', proposalId.toString());

    // Read existing proposals from the JSON file
    let proposals;
    if (fs.existsSync(FILE_PATH)) {
      const rawData = fs.readFileSync(FILE_PATH);
      const data = rawData.toString(); // Convert Buffer to string
      proposals = JSON.parse(data);
    } else {
      proposals = {};
    }

    // Ensure proposals object has an array for the current chain ID
    if (!proposals[chainId]) {
      proposals[chainId] = [];
    }

    // Add the new proposal ID to the array
    proposals[chainId].push(proposalId.toString());

    // Write the updated proposals back to the JSON file
    fs.writeFileSync(FILE_PATH, JSON.stringify(proposals, null, 2));
    console.log(`Proposal ID ${proposalId.toString()} added to chain ${chainId}`);

    const proposalState = await governor.state(proposalId)
    const proposalSnapShot = await governor.proposalSnapshot(proposalId)
    const proposalDeadline = await governor.proposalDeadline(proposalId)
    const currentBlock = await ethers.provider.getBlockNumber();

    // the Proposal State is an enum data type, defined in the IGovernor contract.
    // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
    console.log(`Current Proposal State: ${proposalState}`)
    // What block # the proposal was snapshot
    console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
    // The block number the proposal voting expires
    console.log(`Current Proposal Deadline: ${proposalDeadline}`)

    console.log(`Current block number ${currentBlock}`);
}

const governorAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const boxAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
const functionToCall = "store";
const args:(string | number)[] = [34];
const proposalDescription = "Proposal #1: Storing 34 in the box!";

propose(governorAddress,boxAddress,functionToCall,args, proposalDescription).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

