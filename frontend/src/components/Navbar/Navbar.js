import React from 'react';
import "./Navbar.css"
import { connectMetamask } from '../../utils/initialize';
import { Box, Button, Typography } from "@mui/material"
import { useNavigate } from 'react-router-dom';

const Navbar = (props) => {
  const navigate = useNavigate();

  const handleNavbarClick = () => {
    navigate('/');
  };

    const handleConnect = async () => {
        const result = await connectMetamask();
        if(result.message){
            props.setConnectedAccount(result.result[0]);
        } else {
            alert(result.result)
        }
    }
    const handleDisconnect = async () => {
        props.setConnectedAccount('');
    }

  return (
    <Box display="flex" alignItems="center" justifyContent={'space-around'} gap={4} p={2} className='navbar-wrapper' >
        <Typography variant="h6" gutterBottom onClick={handleNavbarClick} >DAO</Typography>
        <Button variant="outlined" onClick={props.connectedAccount ? handleDisconnect : handleConnect}>{props.connectedAccount ? props.connectedAccount.substring(0, 5) +
                    "..." +
                    props.connectedAccount.substring(
                      props.connectedAccount.length - 5,
                      props.connectedAccount.length
                    ) : 'Connect'}</Button>
    </Box>
  )
}

export default Navbar