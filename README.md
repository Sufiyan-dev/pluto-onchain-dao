# Custom DAO with Advanced On-Chain Voting and Governance

## Overview
This repository contains the code for a decentralized autonomous organization (DAO) with advanced on-chain voting mechanisms, proposal systems, and governance features. The DAO allows members to propose, vote on, and execute multiple types of proposals with varying outcomes, all recorded on the blockchain for transparency and immutability.

## Features
- Smart Contract Development:
    - Single Contract: Manages overall DAO functions, governance, proposal creation, tracking, and execution, and different types of voting mechanisms.
    - Token-based Governance: Voting weight is based on the user's history of token holdings.
    - Proposal Stages: Includes the following stages:
        1. Pending: Proposal has been created but not yet active.
        2. Active: Proposal is open for voting.
        3. Canceled: Proposal has been canceled.
        4. Defeated: Proposal did not meet the quorum or voting requirements.
        5. Succeeded: Proposal met the quorum and voting requirements.
        6. Queued: Proposal is queued for execution.
        7. Expired: Proposal was queued but not executed within the required timeframe.
        8. Executed: Proposal has been executed.

## Governance Model
    -  Roles and Permissions:  No admin role; anyone can propose and vote on proposals.
    - Tokenomics:
        - Voting weight is based on the user's history of token holdings.
        - No staking or rewards for participation.
        - No penalties for malicious behavior.

## Security
### Measures Taken to Ensure Contract Security and Integrity
1. Voter Integrity:
    - Voters can only vote once per proposal.
    - Voting weight is based on the user's history of token holdings.
2. Attack Prevention:
    - Secure from common vulnerabilities and attack vectors.
    - Mechanisms to prevent double voting and Sybil attacks.
    - Validate voter eligibility and vote integrity.
3. Smart Contract Security:
    - Regular audits and security reviews to ensure contract safety.
    - Secure development practices to protect against vulnerabilities.

## Getting Started
### Prerequisites
- Node.js v18.x    

### Smart Contract Deployment
1. Install dependencies:
```zsh
npm install
```
2. Compile the smart contracts:
```zsh
npx hardhat compile
```
3. Deploy to localhost (for development purposes):
```zsh
npx hardhat node
npx hardhat run ./deploy/deployGovernor.js --network localhost
npx hardhat run ./deploy/deployBox.js --network localhost
```

### Interacting with the DAO
1. Proposing:
    - Anyone can propose by calling the propose function with the desired targets, values, calldata, and description.
2. Voting:
    - Users can vote on proposals after the specified delay.
    - Voting weight is determined by the user's history of token holdings.    
3. Queue
    - Once a proposal succeeds, it needs to be queued before execution.
4. Execute
    - After the proposal is queued, it can be executed.

### Frontend
This frontend application allows users to interact with a decentralized autonomous organization (DAO) deployed on a Hardhat local node. Users can view available proposals, vote on them, and see their voting weight as well as the current state of each proposal.

#### Features
- View Proposals: See a list of all active proposals.
- Vote on Proposals: Cast your vote on any proposal.
- Vote Weight: View your voting weight based on your token holdings.
- Proposal State: Check the current state of each proposal.

#### Prerequisites
- Node.js: Ensure you have Node.js installed.
- MetaMask: A MetaMask wallet extension for your browser.
- Hardhat: A local Ethereum development environment.


### Demo 
https://drive.google.com/file/d/1GhqvooIeKEC10m5q1Ybs85QhwWE1Bt5P/view?usp=sharing