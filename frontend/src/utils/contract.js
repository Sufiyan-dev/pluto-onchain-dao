const { ethers } = require("ethers");

/**
 * @function getContractInstance
 * @description Asynchronously creates and returns an instance of a smart contract based on its address and ABI.
 * @param {string} contractAddress - The Ethereum address of the smart contract.
 * @param {object} contractAbi - The ABI (Application Binary Interface) of the smart contract.
 * @param {object} provider - An Ethereum provider instance connected to the network.
 * @returns {object} - An instance of the smart contract.
 */
const getContractInstance = async (contractAddress, contractAbi, provider) => {
    // Create a new instance of the smart contract using ethers.Contract
    const Contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
    );

    // Return the instance of the smart contract
    return Contract;
}

module.exports = { getContractInstance }