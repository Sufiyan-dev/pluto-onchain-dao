import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom';
import { getContractInstance } from '../../utils/contract';
import {config} from '../../utils/config';
import { ethers } from 'ethers';
import { waitForTransactionConfirmation } from '../../utils/waitForTxn';

const ProposalDetail = ({ connectedAccount }) => {
  const [contractInstance, setContractInstance] = useState(undefined);
  const [proposalState, setProposalState] = useState('');
  const [signer, setSigner] = useState(null);
  const [support, setSupport] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVoteWeight, setUserVoteWeight] = useState(0);
  const location = useLocation();

  const { proposal } = location.state || {};
  const states = [" Pending",
        "Active",
        "Canceled",
        "Defeated",
        "Succeeded",
        "Queued",
        "Expired",
        "Executed"];

        useEffect(() => {
          if (connectedAccount) {
            initContractInstance();
          }
        }, [connectedAccount]);
      
        useEffect(() => {
          if (contractInstance) {
            handleUpdateProposalState();
            getUserVoteState();
            getUserVoteWeight()
          }
        }, [contractInstance]);
      
        const initContractInstance = async () => {
          if (window.ethereum) {
            try {
              const contractConfig = config();
              const provider = new ethers.BrowserProvider(window.ethereum);
              // setProvider(provider);
      
              const signer = await provider.getSigner();
              setSigner(signer);
      
              const contract = new ethers.Contract(
                contractConfig.contractAddress,
                contractConfig.contractAbi,
                signer
              );
              setContractInstance(contract);
            } catch (err) {
              console.error("Error initializing contract instance:", err);
              alert("Failed to initialize contract instance. Check console for details.");
            }
          } else {
            alert("MetaMask not found!");
          }
        };
      
        const handleVoteTxn = async () => {
          if (contractInstance) {
            try {
              if(hasVoted) {
                return alert("user already voted");
              }
              const txn = await contractInstance.castVote(proposal.values.proposalId, support);
              console.log("Transaction:", txn);
              console.log("Transaction hash:", txn.hash);
              await txn.wait(); // Wait for the transaction to be mined
              alert("Vote cast successfully!");
              handleUpdateProposalState();
              getUserVoteState();
            } catch (err) {
              console.error("Error casting vote:", err);
              alert(err.message);
            }
          } else {
            alert("Contract instance not found!");
          }
        };
      
        const handleUpdateProposalState = async () => {
          if (contractInstance && proposal) {
            try {
              const state = await contractInstance.state(proposal.values.proposalId);
              console.log("Proposal state:", state, states[state]);
              setProposalState(states[state]);
            } catch (err) {
              console.error("Error fetching proposal state:", err);
              alert("Failed to fetch proposal state. Check console for details.");
            }
          } else {
            alert("Contract instance or proposal not found!");
          }
        };
      
        const getUserVoteState = async () => {
          if (contractInstance && proposal) {
            try {
              const userState = await contractInstance.hasVoted(proposal.values.proposalId, connectedAccount);
              console.log("User vote state:", userState);
              setHasVoted(userState);
            } catch (err) {
              console.error("Error fetching user vote state:", err);
              alert("Failed to fetch user vote state. Check console for details.");
            }
          } else {
            alert("Contract instance or proposal not found!");
          }
        };

        const getUserVoteWeight = async () => {
          if(contractInstance && proposal) {
            try {
              const provider = new ethers.BrowserProvider(window.ethereum);
              const snapshot = await provider.getBlockNumber();
              console.log("block no ", snapshot);
              const weight = await contractInstance.getVotes(connectedAccount,snapshot - 1 );
              console.log("user current vote weight ", weight);
              setUserVoteWeight(Number(weight)/10**18);
            } catch (err) {
              console.error("Error fetching user vote weight:", err);
              alert("Failed to fetch user vote weight. Check console for details.");
            }
          } else {
            alert("Contract instance or proposal not found!");
          }
        }

  if (!proposal) {
    return <div>No proposal data found.</div>;
  }
  
  return (
    <div>
      <h1>Proposal Details</h1>
      <p>Title: {proposal.values.description}</p>
      <p>State : {proposalState}</p><button onClick={handleUpdateProposalState}>Check State</button>
      <p>Vote start time: {proposal.values.voteStart}</p>
      <p>Vote end time: {proposal.values.voteEnd}</p>
      <div>
        <button onClick={handleVoteTxn}>Vote</button>
        <select value={support} onChange={(e) => setSupport(e.target.value)}>
          <option value={0}>Yes</option>
          <option value={1}>No</option>
          <option value={2}>Abstain</option>
        </select>
      </div>
      <div>Has voted : {hasVoted ? 'Voted' :  'Not voted'}</div>
      <div> Account vote weight : {userVoteWeight} </div>
    </div>
  );
}

export default ProposalDetail