import React, {useState} from 'react';
import './DashboardHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const DashboardHeader = ({ user, logOut }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    };

    const userImage = user?.picture ? (
        <img
          src={user.picture}
          alt="user"
          className="user-image"
          onError={(e) => {
            e.target.onerror = null;
            if (typeof user.picture === 'string') {
              e.target.src = user.picture;
            } else {
              e.target.replaceWith(<FontAwesomeIcon icon={faUser} size="2x" />);
            }
          }}
          
        />
      ) : (
        <FontAwesomeIcon icon={faUser} size="2x" />
      );
    
      return (
        <div className="dashboard">
          <header className="header">
            <h1>JobTrackr</h1>
            <div className="user-profile" onClick={toggleDropdown}>
              {userImage}
            </div>
          </header>
    
          {showDropdown && (
            <div className="dropdown">
              <div className="dropdown-content">
                {userImage}
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <button className="logout-btn" onClick={logOut}>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      );
};

export default DashboardHeader;
