import React, { useState } from 'react';
import '../styles/StreamersList.css';
import { FaXmark, FaPlus, FaTrash } from 'react-icons/fa6';

const StreamersList = ({ streamersList, setStreamersList, onClose, currentUser }) => {
  const [newStreamer, setNewStreamer] = useState('');
  const [error, setError] = useState('');

  const handleAddStreamer = () => {
    const username = newStreamer.trim().toLowerCase();
    
    if (!username) {
      setError('Please enter a streamer name');
      return;
    }

    if (streamersList.includes(username)) {
      setError('This streamer is already in your list');
      return;
    }

    setStreamersList([...streamersList, username]);
    setNewStreamer('');
    setError('');
  };

  const handleRemoveStreamer = (username) => {
    setStreamersList(streamersList.filter(s => s !== username));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddStreamer();
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
            <div className="streamers-list-input-group">
              <input
                type="text"
                placeholder="Enter Twitch username..."
                value={newStreamer}
                onChange={(e) => {
                  setNewStreamer(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                className="streamers-list-input"
              />
              <button
                className="streamers-list-add-btn"
                onClick={handleAddStreamer}
                title="Add Streamer"
              >
                <FaPlus /> Add
              </button>
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
