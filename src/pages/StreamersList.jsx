import React, { useState, useEffect, useRef } from 'react';
import '../styles/StreamersList.css';
import { FaXmark, FaTwitch } from 'react-icons/fa6';

const StreamersList = ({ streamersList, setStreamersList, onClose, currentUser }) => {
  const [newStreamer, setNewStreamer] = useState('');
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [, setShowDropdown] = useState(false);
  const [streamerProfiles, setStreamerProfiles] = useState({});
  const [, setLoadingProfiles] = useState(false);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Load cached profiles from localStorage on mount
  useEffect(() => {
    const cachedProfiles = localStorage.getItem('streamerProfiles');
    if (cachedProfiles) {
      try {
        setStreamerProfiles(JSON.parse(cachedProfiles));
      } catch (e) {
        console.error('Failed to parse cached profiles:', e);
      }
    }
  }, []);

  // Fetch profile data for existing streamers
  useEffect(() => {
    const fetchProfiles = async () => {
      // Find streamers that don't have profiles yet
      const missingProfiles = streamersList.filter(username => !streamerProfiles[username]);
      
      if (missingProfiles.length === 0) return;
      
      // Don't show loading state if we already have cached data
      if (Object.keys(streamerProfiles).length === 0) {
        setLoadingProfiles(true);
      }
      
      try {
        const response = await fetch(
          `http://localhost:5000/api/twitch/users?usernames=${missingProfiles.join(',')}`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          // Extract profile images from the response
          const newProfiles = {};
          Object.keys(data.users).forEach(username => {
            newProfiles[username] = data.users[username].profileImage;
          });
          
          if (Object.keys(newProfiles).length > 0) {
            setStreamerProfiles(prev => {
              const updated = { ...prev, ...newProfiles };
              // Save to localStorage for instant loading next time
              localStorage.setItem('streamerProfiles', JSON.stringify(updated));
              return updated;
            });
          }
        }
      } catch (error) {
      } finally {
        setLoadingProfiles(false);
      }
    };
    
    if (streamersList.length > 0) {
      // Fetch immediately without delay
      fetchProfiles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamersList.join(',')]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search Twitch users as user types
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (newStreamer.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/twitch/search-users?query=${encodeURIComponent(newStreamer)}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.users || []);
          setShowDropdown(data.users && data.users.length > 0);
        }
      } catch (error) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [newStreamer]);

  const handleSelectUser = (user) => {
    const username = user.username.toLowerCase();
    if (streamersList.includes(username)) {
      setError('This streamer is already in your list');
      setNewStreamer('');
      setShowDropdown(false);
      return;
    }

    setStreamersList([...streamersList, username]);
    setStreamerProfiles(prev => ({
      ...prev,
      [username]: user.profileImage
    }));
    setNewStreamer('');
    setSearchResults([]);
    setShowDropdown(false);
    setError('');
  };

  const handleRemoveStreamer = (username) => {
    setStreamersList(streamersList.filter(s => s !== username));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setError('Please select a user from the search results');
    }
  };

  return (
    <div className="streamers-list-modal-overlay">
      <div className="streamers-list-modal">
        <div className="streamers-list-header">
          <h2>Manage Streamers List</h2>
          <button
            className="streamers-list-close-btn"
            onClick={onClose}
            title="Close"
          >
            <FaXmark />
          </button>
        </div>

        <div className="streamers-list-content">
          {/* Add New Streamer Section */}
          <div className="streamers-list-add-section">
            <div className="streamers-list-input-group" ref={dropdownRef}>
              <div className="streamers-list-input-wrapper">
                <input
                  type="text"
                  placeholder="Search Twitch users..."
                  value={newStreamer}
                  onChange={(e) => {
                    setNewStreamer(e.target.value);
                    setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  className="streamers-list-input"
                />
                {isSearching && (
                  <div className="streamers-search-loading">
                    <div className="streamers-search-spinner"></div>
                  </div>
                )}
                
                {/* Search Results Dropdown */}
                {!isSearching && newStreamer.trim().length > 0 && searchResults.length > 0 && (
                  <div className="streamers-search-dropdown">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="streamers-search-result"
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="streamers-search-avatar">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.displayName} />
                          ) : (
                            <FaTwitch />
                          )}
                        </div>
                        <div className="streamers-search-info">
                          <div className="streamers-search-name">
                            {user.displayName}
                            {user.isLive && <span className="streamers-live-badge">LIVE</span>}
                          </div>
                          <div className="streamers-search-username">@{user.username}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* No Results Message */}
                {!isSearching && newStreamer.trim().length > 0 && searchResults.length === 0 && (
                  <div className="streamers-search-dropdown">
                    <div className="streamers-no-results">
                      No Twitch users found for "{newStreamer}"
                    </div>
                  </div>
                )}
              </div>
            </div>
            {error && <p className="streamers-list-error">{error}</p>}
          </div>

          {/* Streamers List */}
          <div className="streamers-list-items">
            {streamersList.length === 0 ? (
              <p className="streamers-list-empty">No streamers added yet. Add your first streamer above!</p>
            ) : (
              <ul>
                {streamersList.map((username) => (
                  <li key={username} className="streamers-list-item">
                    <button
                      className="streamer-remove-btn"
                      onClick={() => handleRemoveStreamer(username)}
                      title="Remove Streamer"
                    >
                      <FaXmark />
                    </button>
                    <div className="streamer-avatar">
                      {streamerProfiles[username] ? (
                        <img 
                          src={streamerProfiles[username]} 
                          alt={username}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="streamer-avatar-loading"><div class="spinner"></div></div>';
                          }}
                        />
                      ) : (
                        <div className="streamer-avatar-loading">
                          <div className="spinner"></div>
                        </div>
                      )}
                    </div>
                    <span className="streamer-name">{username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="streamers-list-footer">
          <p className="streamers-list-info">
            Total streamers: <strong>{streamersList.length}</strong>
          </p>
          <button className="streamers-list-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreamersList;
