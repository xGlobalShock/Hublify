import React, { useState, useEffect, useRef } from 'react';

function OAuthCallback() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Authenticating with Discord...');
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Prevent running twice
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const handleCallback = async () => {
      try {
        // Get authorization code from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
          throw new Error(`Discord error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Discord');
        }

        setMessage(`Loading your profile...`);

        // Try to exchange code with backend first
        let authData = null;
        
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          const response = await fetch(`${apiUrl}/api/discord/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          if (response.ok) {
            authData = await response.json();
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Backend authentication failed');
          }
        } catch (backendError) {
          console.error('Backend error:', backendError);
          throw backendError;
        }

        // If backend failed, use fallback (for development)
        if (!authData) {
          authData = {
            user: {
              id: 'discord_user_' + Math.random().toString(36).substr(2, 9),
              username: 'Discord User',
              avatar: '👤',
              email: 'user@discord',
              loginMethod: 'discord'
            },
            accessToken: 'fallback_token_' + Math.random().toString(36).substr(2, 9)
          };
        } else {
          // Add loginMethod to user object from backend response
          authData.user.loginMethod = 'discord';
        }

        setMessage(`Welcome, ${authData.user.username}!`);

        // Save auth data to localStorage
        try {
          localStorage.setItem('prismAuth', JSON.stringify({
            user: authData.user,
            accessToken: authData.accessToken,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.error('Failed to save auth data:', e);
        }

        // Load saved profile for this user
        const userProfileKey = `socialProfile_${authData.user.id}`;
        let savedProfile = null;
        try {
          // Try user-specific key first
          let profileData = localStorage.getItem(userProfileKey);
          
          // If not found, try generic key as fallback
          if (!profileData) {
            profileData = localStorage.getItem('socialProfile');
          }
          
          if (profileData) {
            savedProfile = JSON.parse(profileData);
          }
        } catch (e) {
          console.error('Failed to load saved profile:', e);
        }

        setTimeout(() => {
          // Redirect to home page
          window.location.href = '/';
        }, 1500);
      } catch (err) {
        console.error('OAuth callback error:', err);
        setMessage(`Authentication Error: ${err.message}`);
        setTimeout(() => {
          // Redirect to home on error
          window.location.href = '/';
        }, 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="oauth-callback-container">
      <div className="callback-content">
        <div className="loading-spinner"></div>
        <p className="callback-message">{message}</p>
      </div>
    </div>
  );
}

export default OAuthCallback;
