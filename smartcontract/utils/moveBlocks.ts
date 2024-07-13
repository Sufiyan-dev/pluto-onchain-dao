import { network } from "hardhat";

export async function moveBlocks(amount: number) {
    console.log("moving blockss ....");
    for(let i = 0; i < amount; i++){
        await network.provider.request({
            method: "evm_mine",
            params: []
        });
    }
}