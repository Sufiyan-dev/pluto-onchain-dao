import React, { useEffect, useState } from 'react'
import './ProposalList.css'
import Navbar from '../../components/Navbar/Navbar.js'
import { getAllProposals } from '../../utils/query.js'
import { ethers } from 'ethers'
import { Card, Typography, Box, Grid, Paper, styled } from '@mui/material';
import { useNavigate } from "react-router-dom";

const ProposalList = ({ connectedAccount, setConnectedAccount }) => {
    const [proposals, setProposals] = useState([]);

    const navigate = useNavigate();

    const handleProposalClick = (proposal, id) => {
      navigate(`/proposal/${id}`, { state: { proposal } });
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    }));

    useEffect(() => {
        const getProposals = async () => {
            const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/');

            const network = await provider.getNetwork();
            console.log('Connected to network:', network);

            const result = await getAllProposals(provider);

            console.log("res",result);

            if(result.error){
                alert(result.msg);
            } else {
                setProposals(result.msg);
            }

        }
        getProposals();
    },[])
  return (
    <div>
        {
            proposals.length > 0 ? <Grid container>
                {proposals.map((proposal,i) => (
                    <Grid xs={4} key={i} margin={2} onClick={() => handleProposalClick(proposal, i)}>
                        <Item>
                            <Typography>Title : {proposal.values.description}</Typography>
                            <Typography>Vote start time : {proposal.values.voteStart}</Typography>
                            <Typography>Vote end time  : {proposal.values.voteEnd}</Typography>
                        </Item>
                    </Grid>
                ))}
            </Grid> : "Loading..."
        }
    </div>
  )
}

export default ProposalList