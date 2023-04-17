import React, { useState } from 'react';
import './Dashboard.css';
import jobTrackerBg from './assets/jobTrackrBg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Dashboard = ({ profile, logout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const userImage = profile?.picture ? (
    <img
      src={profile.picture}
      alt="user"
      className="user-image"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '';
        e.target.replaceWith(<FontAwesomeIcon icon={faUser} size="2x" />);
      }}
    />
  ) : (
    <FontAwesomeIcon icon={faUser} size="2x" />
  );

  return (
    <div className="dashboard">
      <header className="header">
        <img src={jobTrackerBg} alt="JobTrackr logo" className="logo" />
        <h1>JobTrackr</h1>
        <div className="user-profile" onClick={toggleDropdown}>
          {userImage}
        </div>
      </header>

      {showDropdown && (
        <div className="dropdown">
          <div className="dropdown-content">
            {userImage}
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <button className="logout-btn" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
