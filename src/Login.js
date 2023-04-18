import React from 'react';
import './Login.css';
import googleLogo from './assets/google_logo.png';

const Login = ({ login }) => {
    return (
        <div className="login-container">
            <h1>Welcome to JobTrackr</h1>
            <button onClick={() => login()} className="login-btn">
                <img src={googleLogo} alt="Google logo" className="google-logo" />
                Continue with Google
            </button>
        </div>
    );
};

export default Login;
