import React, { useState, useEffect, useRef } from 'react';
import { FaDiscord } from 'react-icons/fa6';
import { MdPerson, MdRocket, MdGroups, MdVideoLibrary } from 'react-icons/md';
import StarsBackground from '../effects/StarsBackground';

const DISCORD_CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_DISCORD_REDIRECT_URI || 'http://localhost:3000/callback';

function Login({ onLoginSuccess }) {
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringDiscord, setIsHoveringDiscord] = useState(false);
  const [isHoveringGuest, setIsHoveringGuest] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDiscordLogin = () => {
    if (!DISCORD_CLIENT_ID) {
      setError('Discord Client ID is not configured');
      return;
    }

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
    <div className="login-container" ref={containerRef}>
      {/* Stars Background */}
      <StarsBackground 
        className="login-stars-bg"
        speed={60}
        starColor="#00d4ff"
        factor={0.03}
      />

      {/* Ambient Orbs */}
      <div className="ambient-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Main content */}
      <div className="login-overlay">
        <div 
          className="login-box"
          style={{
            transform: `perspective(1000px) rotateY(${(mousePosition.x - 50) * 0.02}deg) rotateX(${(50 - mousePosition.y) * 0.02}deg)`
          }}
        >
          {/* Animated Border */}
          <div className="animated-border"></div>
          
          {/* Logo Section */}
          <div className="login-logo-section">
            <div className="logo-ring">
              <div className="ring-segment"></div>
              <div className="ring-segment"></div>
              <div className="ring-segment"></div>
            </div>
            
            <div className="logo-text">
              <span className="logo-h">H</span>
              <span className="logo-ublify">ublify</span>
            </div>
            
            <div className="logo-tagline">
              <div className="tagline-line"></div>
              <span>NEXT-GEN STREAMING</span>
              <div className="tagline-line"></div>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="auth-section">
            <button 
              className="modern-auth-btn discord-btn" 
              onClick={handleDiscordLogin}
              onMouseEnter={() => setIsHoveringDiscord(true)}
              onMouseLeave={() => setIsHoveringDiscord(false)}
            >
              <div className="btn-particles">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="particle" style={{ '--i': i }}></div>
                ))}
              </div>
              <div className="btn-glow"></div>
              <div className="btn-content">
                <FaDiscord className="btn-icon" />
                <div className="btn-text-container">
                  <span className="btn-text">Continue with Discord</span>
                  <span className="btn-subtext">Join the community</span>
                </div>
                <div className={`btn-arrow ${isHoveringDiscord ? 'active' : ''}`}>→</div>
              </div>
            </button>

            <div className="modern-divider">
              <div className="divider-line"></div>
              <div className="divider-circle">
                <div className="circle-ring"></div>
                <span>OR</span>
              </div>
              <div className="divider-line"></div>
            </div>

            <button 
              className="modern-auth-btn guest-btn" 
              onClick={handleGuestLogin}
              onMouseEnter={() => setIsHoveringGuest(true)}
              onMouseLeave={() => setIsHoveringGuest(false)}
            >
              <div className="btn-particles">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="particle" style={{ '--i': i }}></div>
                ))}
              </div>
              <div className="btn-glow"></div>
              <div className="btn-content">
                <MdPerson className="btn-icon" />
                <div className="btn-text-container">
                  <span className="btn-text">Continue as Guest</span>
                  <span className="btn-subtext">Quick access mode</span>
                </div>
                <div className={`btn-arrow ${isHoveringGuest ? 'active' : ''}`}>→</div>
              </div>
            </button>

            {error && (
              <div className="error-banner">
                <div className="error-icon">⚠</div>
                {error}
              </div>
            )}
          </div>

          {/* Feature Grid */}
          <div className="feature-grid">
            <div className="feature-card">
              <MdVideoLibrary className="feature-icon" />
              <span className="feature-label">Live Streams</span>
              <div className="feature-shine"></div>
            </div>
            <div className="feature-card">
              <MdGroups className="feature-icon" />
              <span className="feature-label">Community</span>
              <div className="feature-shine"></div>
            </div>
            <div className="feature-card">
              <MdRocket className="feature-icon" />
              <span className="feature-label">Innovation</span>
              <div className="feature-shine"></div>
            </div>
          </div>

          {/* Stats Counter */}
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-value">10K+</div>
              <div className="stat-label">Users</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Live</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Free</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <div className="footer-pulse"></div>
          <span className="footer-text">Powered by the future of streaming technology</span>
          <div className="footer-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

