import React, { useState } from 'react'
import './Main.js'
import Navbar from '../../components/Navbar/Navbar.js'

const Main = () => {
    const [connectedAccount, setConnectedAccount] = useState("");
  return (
    <div>
        <Navbar connectedAccount={connectedAccount} setConnectedAccount={setConnectedAccount}/>
        Main
    </div>
  )
}

export default Main