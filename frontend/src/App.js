import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import ProposalList from './pages/ProposalList/ProposalList';
import ProposalDetail from './pages/ProposalDetail/ProposalDetail';
import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';

function App() {
  const [connectedAccount, setConnectedAccount] = useState("");
  return (
    <Router>
       <Navbar connectedAccount={connectedAccount} setConnectedAccount={setConnectedAccount} />
      <Routes>
        <Route exact path="/" element={<ProposalList connectedAccount={connectedAccount} setConnectedAccount={setConnectedAccount} />} />
        <Route path="/proposal/:id"  element={<ProposalDetail connectedAccount={connectedAccount} />} />
      </Routes>
    </Router>
  );
}

export default App;
