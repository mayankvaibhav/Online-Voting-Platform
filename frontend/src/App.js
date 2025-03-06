import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import Login from "./login.js" 
import Login from './react files/login page/login.jsx';
import LandingPage from './Landing_page.jsx';
import Register from './react files/register page/register.jsx';
import Admin from './react files/admin page/admin.jsx';
import CastVote from "./react residue/cast vote/castVote.jsx"
import ElectionCreation from './react residue/election creation/electioncreation.jsx';

import ElectionCreatedRegistered from './react residue/elections by admin/electionsbyadmin.jsx';
import AllElections from './react residue/all elections/allElections.jsx';
import NewHomePage from './suraj/homepage.jsx';
import AdminList from './react files/admin list/adminList.jsx';

const App = () => {
  return (
    <Router>
      <div>
        {/* Define the Routes */}
        <Routes>
          {/* Route for the Home page */}
          {/* <Route path="/" element={<Home />} /> */}

          {/* Route for the Register page */}

          <Route path="/" element={<LandingPage />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<NewHomePage />} />

          <Route path="/home/admin" element={<Admin />} />

          <Route path="/home/admin/createElection" element={<ElectionCreation />} />

          <Route path="/home/admin/electionsByAdmin" element={<ElectionCreatedRegistered />} />

          <Route path="/home/castVote" element={<CastVote />} />
          <Route path="/home/allElections" element={<AllElections />} />
          <Route path="/home/adminList" element={<AdminList />} />














        </Routes>
      </div>
    </Router>
  );
};

export default App;
