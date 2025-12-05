import React, { useState, useEffect, useCallback } from 'react';
import '../styles/StreamersPreview.css';
import { FaSpinner, FaUsers, FaXmark, FaEye, FaHeart } from 'react-icons/fa6';
import { RiLiveFill } from 'react-icons/ri';
import { PiGameControllerBold } from 'react-icons/pi';

const StreamersPreview = ({ streamersList, userId, isStreamersVisible, setIsStreamersVisible }) => {
  const [streamersData, setStreamersData] = useState([]);
  const [loading, setLoading] = useState(false);

  const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID || '';
  const TWITCH_CLIENT_SECRET = process.env.REACT_APP_TWITCH_CLIENT_SECRET || '';

  // Get Twitch access token
  const getTwitchAccessToken = useCallback(async () => {
    try {
      const url = `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;
      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        return data.access_token;
      }
    } catch (error) {
      console.error('Error getting Twitch token:', error);
    }
    return null;
  }, [TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET]);

  // Fetch streamer data from Twitch
  const fetchStreamerData = useCallback(async (username, token) => {
    if (!token) return null;

    try {
      const headers = {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`
      };

      // Fetch user info
      const userResponse = await fetch(
        `https://api.twitch.tv/helix/users?login=${username}`,
        { headers }
      );
      const userData = await userResponse.json();

      if (!userData.data || userData.data.length === 0) {
        return null;
      }

      const user = userData.data[0];

      // Fetch stream status
      const streamResponse = await fetch(
        `https://api.twitch.tv/helix/streams?user_login=${username}`,
        { headers }
      );
      const streamData = await streamResponse.json();
      const isLive = streamData.data && streamData.data.length > 0;
      const stream = isLive ? streamData.data[0] : null;

      // Fetch followers
      const followersResponse = await fetch(
        `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${user.id}`,
        { headers }
      );
      const followersData = await followersResponse.json();
      const followers = followersData.total || 0;

      // Fetch game info if live
      let gameName = '';
      if (isLive && stream.game_id) {
        const gameResponse = await fetch(
          `https://api.twitch.tv/helix/games?id=${stream.game_id}`,
          { headers }
        );
        const gameData = await gameResponse.json();
        gameName = gameData.data[0]?.name || '';
      }

      return {
        username: user.login,
        displayName: user.display_name,
        profileImage: user.profile_image_url,
        isLive,
        viewers: stream?.viewer_count || 0,
        game: gameName,
        followers,
        twitchUrl: `https://twitch.tv/${user.login}`
      };
    } catch (error) {
      console.error('Error fetching streamer data:', error);
      return null;
    }
  }, [TWITCH_CLIENT_ID]);

  // Load and fetch data on mount or when list changes
  useEffect(() => {
    const loadStreamers = async () => {
      if (!streamersList || streamersList.length === 0) return;

      setLoading(true);
      const token = await getTwitchAccessToken();
      
      if (token) {
        const dataPromises = streamersList.map(username =>
          fetchStreamerData(username, token)
        );
        const results = await Promise.all(dataPromises);
        setStreamersData(results.filter(data => data !== null));
      }
      setLoading(false);
    };

    loadStreamers();
  }, [streamersList, getTwitchAccessToken, fetchStreamerData]);

  if (!streamersList || streamersList.length === 0) {
    return null; // Don't render if no streamers
  }

  return (
    <div className={`streamers-preview-container ${isStreamersVisible ? 'open' : ''}`}>
      {/* Collapsed Button */}
      {!isStreamersVisible && (
        <button
          className="streamers-preview-collapsed-btn"
          onClick={() => setIsStreamersVisible(true)}
          title="Suggested Streamers"
        >
          <FaUsers />
        </button>
      )}

      {/* Expanded View */}
      {isStreamersVisible && (
        <div className="streamers-preview-expanded">
          <div className="streamers-preview-header">
            <div className="streamers-preview-title">
              <FaUsers />
              <span>Suggested Streamers</span>
            </div>
            <button
              className="streamers-preview-close-btn"
              onClick={() => setIsStreamersVisible(false)}
              title="Close"
            >
              <FaXmark />
            </button>
          </div>

          <div className="streamers-preview-list">
            {loading && streamersData.length === 0 ? (
              <div className="streamers-preview-loading">
                <FaSpinner className="spinner" />
              </div>
            ) : streamersData.length === 0 ? (
              <p className="streamers-preview-empty">No streamers yet</p>
            ) : (
              streamersData.map((streamer) => (
                <a
                  key={streamer.username}
                  href={streamer.twitchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="streamers-preview-item"
                  data-status={streamer.isLive ? 'live' : 'offline'}
                >
                  <img src={streamer.profileImage} alt={streamer.displayName} className="streamer-preview-pfp" />
                  
                  <div className="streamer-preview-info">
                    <span className="streamer-preview-name">{streamer.displayName}</span>
                    <span className="streamer-preview-followers"><FaHeart /> {streamer.followers.toLocaleString()} Followers</span>
                    {streamer.isLive && streamer.game && (
                      <span className="streamer-preview-game"><PiGameControllerBold /> Playing: {streamer.game}</span>
                    )}
                  </div>

                  <div className="streamer-preview-status">
                    {streamer.isLive && (
                      <>
                        <span className="status-badge live"><RiLiveFill /> LIVE</span>
                        <span className="streamer-preview-viewers"><FaEye /> {streamer.viewers.toLocaleString()} Viewers</span>
                      </>
                    )}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamersPreview;
