import React from 'react';
import "./Navbar.css"

const Navbar = (props) => {
    async function connectMetamask() {
        try {
          //check metamask is installed
          if (window.ethereum) {
            // instantiate Web3 with the injected provider
            // const web3 = new Web3(window.ethereum);
    
            //request user to connect accounts (Metamask will prompt)
            const result = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("result ", result)
    
            //get the connected accounts
            // const accounts = await web3.eth.getAccounts();
    
            //show the first connected account in the react page
            props.setConnectedAccount(result[0]);
          } else {
            alert("Please download metamask");
          }
        } catch (err) {
          alert(err.message)
        }
      }

  return (
    <div className='navbar-wrapper'>
        <button onClick={connectMetamask}>{props.connectedAccount ? props.connectedAccount : 'Connect'}</button>
    </div>
  )
}

export default Navbar