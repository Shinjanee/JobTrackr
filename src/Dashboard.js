import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import DashboardHeader from './DashboardHeader';
import MatchJD from './MatchJD';
import Resume from './Resume';
import TrackApplications from './TrackApplications';

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = ({ profile, logOut, refreshAccessToken }) => {
  const [activeTab, setActiveTab] = useState('resume');
  const [hasResume, setHasResume] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchResumeStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/resume/${profile.id}`);
      setHasResume(response.data.resumeText !== null && response.data.resumeText !== '');
    } catch (error) {
      console.error("Error fetching resume status:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'matchJD') {
      fetchResumeStatus();
    }
  }, [activeTab]);
  

  return (
    <div className="dashboard">
      {profile && <DashboardHeader user={profile} logOut={logOut} />} {/* Render DashboardHeader only if user is defined */}
      <div className="tabs">
      <button
          className={`tab ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => handleTabClick('resume')}
        >
          Resume
        </button>
        <button
          className={`tab ${activeTab === 'matchJD' ? 'active' : ''}`}
          onClick={() => handleTabClick('matchJD')}
        >
          Match JD
        </button>
        <button
          className={`tab ${activeTab === 'trackApplications' ? 'active' : ''}`}
          onClick={() => handleTabClick('trackApplications')}
        >
          Track Applications
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'matchJD' ? <MatchJD profile={profile} hasResume={hasResume}/> : activeTab === 'resume' ? <Resume profile={profile} setHasResume={setHasResume}/> : <TrackApplications profile={profile} refreshAccessToken={refreshAccessToken}
/>}
      </div>
    </div>
  );
};

export default Dashboard;
