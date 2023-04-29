import React, { useState } from 'react';
import './Dashboard.css';
import DashboardHeader from './DashboardHeader';
import MatchJD from './MatchJD';
import TrackApplications from './TrackApplications';

const Dashboard = ({ profile, logOut }) => {
  const [activeTab, setActiveTab] = useState('matchJD');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="dashboard">
      {profile && <DashboardHeader user={profile} logOut={logOut} />} {/* Render DashboardHeader only if user is defined */}
      <div className="tabs">
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
        {activeTab === 'matchJD' ? <MatchJD /> : <TrackApplications profile={profile} />}
      </div>
    </div>
  );
};

export default Dashboard;
