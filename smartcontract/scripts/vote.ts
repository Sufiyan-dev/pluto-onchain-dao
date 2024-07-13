import fs from 'fs';
import { ethers, network } from 'hardhat';
import path from 'path';
import { moveBlocks } from '../utils/moveBlocks';

const FILE_PATH = path.join(__dirname, 'proposals.json');

const VOTING_PERIOD = 5;
const VOTING_DELAY = 1;

export async function vote(proposalIndex: number, governorAddress: string) {
    const proposals = JSON.parse(fs.readFileSync(FILE_PATH).toString());
    let chainId;
    if(["hardhat","localhost"].includes(network.name)){
        chainId = 31337 // Set chainId to 31337 for Hardhat or localhost
    } else {
        console.log("network config : ",network.config);
        chainId = network.config.chainId || 0;
    }

    const proposalId = proposals[chainId][proposalIndex];
    // 0 = Against, 1 = For, 2 = Abstain for this example
    const voteWay = 1
    const reason = "I lika do da cha cha"

    const governor = await ethers.getContractAt("GovernorContract",governorAddress);

    
    if(["hardhat","localhost"].includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }
    
    const proposalStateBefore = await governor.state(proposalId)
    console.log(`Before Proposal State: ${proposalStateBefore}`);

    const voteTxResponse = await governor.castVoteWithReason(proposalId,voteWay,reason);
    await voteTxResponse.wait(1);
    
    if (["hardhat","localhost"].includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
    
    const proposalStateAfter = await governor.state(proposalId)
    console.log(`After Proposal State: ${proposalStateAfter}`);

    console.log("Voted let's go!");
}
const index = 1;
const governorAddress = '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'

vote(index,governorAddress).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});