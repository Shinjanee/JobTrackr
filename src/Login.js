import React from 'react';
import './Login.css';
import googleLogo from './assets/google_logo.png';
import jobTrackrBg from './assets/jobTrackrBg.png';

const Login = ({ login }) => {
    return (
        <div className="login-container" style={{ backgroundImage: `url(${jobTrackrBg})` }}>
            <h1>Welcome to JobTrackr</h1>
            <button onClick={() => login()} className="login-btn">
                <img src={googleLogo} alt="Google logo" className="google-logo" />
                Continue with Google
            </button>
        </div>
    );
};

export default Login;
