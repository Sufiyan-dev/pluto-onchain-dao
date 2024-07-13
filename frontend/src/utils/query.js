import ethers from 'ethers';
import { getContractInstance } from './contract';
import { config } from './config';

export async function getAllProposals(provider) {
    try {
        const {contractAddress, contractAbi} = config();

        const contract = await getContractInstance(contractAddress,contractAbi,provider);
        // console.log(contract)

        const createProposal = await contract.filters.ProposalCreated().getTopicFilter();
        console.log(createProposal[0])

        const startBlock = '0x' + (0).toString(16);
        const endBlock = 'latest'

        const events = await provider.send('eth_getLogs',[{
            address: [
                contractAddress
            ],
            fromBlock: startBlock,
            toBlock: endBlock,
            topics: [
                [
                    createProposal[0]
                ]
            ]
        }]);

        // Event parameter names mapping
        const eventParameterNames = {
            ProposalCreated: ['proposalId', 'proposer', 'targets', 'values', 'signatures', 'calldatas', 'voteStart', 'voteEnd', 'description']
            // Add more events as needed
        };

        // Decode logs
        const decodedEvents = events.map(event => {
            const eventInterface = contract.interface;
            const logDescription = eventInterface.parseLog(event);
            const parameterNames = eventParameterNames[logDescription.name] || [];
            console.log("params ",parameterNames)

            // Map the parameter names to their values
            const values = parameterNames.reduce((acc, paramName, index) => {
                const value = logDescription.args[index];

                // Handle special cases like BigInt or specific object structures
                if (typeof value === 'bigint') {
                    acc[paramName] = value.toString();
                } else if (value instanceof Array) { // Assuming Proxy is used for specific types
                    // Extract values from Proxy or handle accordingly
                    // Example: acc[paramName] = value[0];
                    // This depends on the actual structure of Proxy(Result)
                    acc[paramName] = value[0];
                } else {
                    acc[paramName] = value;
                }

                return acc;
            }, {});
            return {
                eventName: logDescription.name,
                values,
                blockNumber: (event.blockNumber).toString(),
                transactionHash: event.transactionHash
            };

            
        });    
        
        
        return { msg: decodedEvents, error: false };

    } catch(err){
        console.log("error while fetching all the proposals",err);
        return { msg: err.message, error: true };
    }
}

// async function fetchLatestInteractions(contractAddress, contractAbi) {
//     try {
//             const provider = await getProvider();
//             const contract = await getContractInstance(contractAddress, contractAbi, provider);

//             // Filter
//             const marketFilter = await contract.filters.MarketCreated().getTopicFilter();
//             const betPlacedFilter = await contract.filters.BetPlaced().getTopicFilter();
//             const marketResolvedFilter = await contract.filters.MarketResolved().getTopicFilter();

//             const startBlock = '0x' + BigInt(0).toString(16);
//             const endBlock = 'latest'
    
//             const events = await provider.send('eth_getLogs',[{
//                 address: [
//                     contractAddress
//                 ],
//                 fromBlock: startBlock,
//                 toBlock: endBlock,
//                 topics: [
//                     [
//                         marketFilter[0],
//                         betPlacedFilter[0],
//                         marketResolvedFilter[0]
//                     ]
//                 ]
//             }]);
    
//             // Event parameter names mapping
//             const eventParameterNames = {
//                 MarketCreated: ['marketAddress', 'numberOfOptions', 'eventHash', 'startTime', 'expirationTime'],
//                 BetPlaced: ['user', 'amount', 'option'],
//                 MarketResolved: ['winningOption']
//             };
    
//             // Decode logs
//             const decodedEvents = events.map(async event => {
//                 const eventInterface = contract.interface;
//                 const logDescription = eventInterface.parseLog(event);
//                 const parameterNames = eventParameterNames[logDescription.name] || [];
//                 console.log("dis ",logDescription);

//                 // Map the parameter names to their values
//                 const values = logDescription.args.reduce((acc, value, index) => {
//                     const paramName = parameterNames[index] || `param${index}`;
//                     acc[paramName] = typeof value === 'bigint' ? value.toString() : value;
//                     return acc;
//                 }, {});

//                 // Get timestamp asynchronously
//                 const timestamp = await getEventTimestamp(event.blockNumber, contract);
    
//                 return {
//                     eventName: logDescription.name,
//                     values,
//                     blockNumber: BigInt(event.blockNumber).toString(),
//                     transactionHash: event.transactionHash,
//                     timestamp
//                 };

//             });
//             // Wait for all promises in decodedEvents to resolve
//             const decodedEventsWithTimestamps = await Promise.all(decodedEvents);
            
//             return { msg: decodedEventsWithTimestamps, error: false };

//     } catch (error) {
//         console.error('Error fetching interactions:', error);
//         return { msg: error.message, error: true };
//     }
// }

// Assume you have an async function to get provider and contract
const getEventTimestamp = async (blockNumber, contract, provider) => {
    try {
        const blockHex = '0x' +  (blockNumber).toString(16);
        const block = await provider.getBlock(blockHex);

        if (block) {
            return block.timestamp // Convert timestamp to human-readable format if needed
        } else {
            throw new Error(`Block not found for block number: ${blockNumber}`);
        }
    } catch (error) {
        console.error("Error fetching block information:", error);
        // Handle error as needed, e.g., show error message, log, etc.
        throw error;
    }
};
