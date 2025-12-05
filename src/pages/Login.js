import React, { useState } from 'react';
import LightRays from '../effects/LightRays';
import BackgroundPreview from '../lib/BackgroundPreview';
import { FaDiscord } from 'react-icons/fa6';
import { MdPerson } from 'react-icons/md';
import { FaPalette, FaImage, FaLink } from 'react-icons/fa6';

const DISCORD_CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_DISCORD_REDIRECT_URI || 'http://localhost:3000/callback';

function Login({ onLoginSuccess }) {
  const [error, setError] = useState('');

  const handleDiscordLogin = () => {
    if (!DISCORD_CLIENT_ID) {
      setError('Discord Client ID is not configured');
      return;
    }

    // Use implicit flow for development (no backend required)
    // In production, use authorization code flow with a backend
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email&prompt=consent`;
    
    window.location.href = discordAuthUrl;
  };

  const handleGuestLogin = () => {
    onLoginSuccess({
      isGuest: true,
      user: {
        id: 'guest_' + Math.random().toString(36).substr(2, 9),
        username: 'Guest User',
        avatar: '👤'
      }
    });
  };

  return (
    <div className="login-container">
      <LightRays raysColor="#0099ff" />
      <div className="background-preview-wrapper">
        <BackgroundPreview />
      </div>
      <div className="login-content">
        <h1 className="login-title">✨ Hublify</h1>
        <p className="login-subtitle">Create your stunning profile</p>
        
        <div className="login-buttons">
          <button className="login-btn discord-btn" onClick={handleDiscordLogin}>
            <FaDiscord className="login-icon" />
            <span>Login with Discord</span>
          </button>

          <div className="login-divider">or</div>

          <button className="login-btn guest-btn" onClick={handleGuestLogin}>
            <MdPerson className="login-icon" />
            <span>Continue as Guest</span>
          </button>
        </div>

        {error && <p className="login-error">{error}</p>}

        <div className="login-features">
          <div className="feature">
            <FaPalette className="feature-icon" />
            <span>Customize Your Profile</span>
          </div>
          <div className="feature">
            <FaImage className="feature-icon" />
            <span>Choose Backgrounds</span>
          </div>
          <div className="feature">
            <FaLink className="feature-icon" />
            <span>Add Social Links</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
