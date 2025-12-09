import React, { useState } from 'react';
import '../styles/StreamSchedule.css';
import { MdClose, MdDelete, MdEdit, MdPublic } from 'react-icons/md';
import { FaPlus, FaCalendar, FaClock, FaGamepad, FaCircleExclamation } from 'react-icons/fa6';

const StreamSchedule = ({ streamSchedule, setStreamSchedule, currentUser }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    game: '',
    status: 'scheduled',
    timezone: 'UTC+1'
  });

  const timezones = [
    'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1',
    'UTC+0', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'
  ];

  const DAYS_OF_WEEK = [
    { day: 1, label: 'Monday' },
    { day: 2, label: 'Tuesday' },
    { day: 3, label: 'Wednesday' },
    { day: 4, label: 'Thursday' },
    { day: 5, label: 'Friday' },
    { day: 6, label: 'Saturday' },
    { day: 7, label: 'Sunday' }
  ];

  const GAMES = [
    'Apex Legends',
    'Valorant',
    'League of Legends',
    'Counter-Strike 2',
    'Dota 2',
    'Fortnite',
    'Call of Duty',
    'Minecraft',
    'Just Chatting',
    'IRL',
    'Other'
  ];


  const getDateForDay = (dayIndex) => {
    const numDay = parseInt(dayIndex, 10);
    const today = new Date();
    let currentDayOfWeek = today.getDay();
    if (currentDayOfWeek === 0) currentDayOfWeek = 7;

    const offsetToMonday = 1 - currentDayOfWeek;
    const mondayOfThisWeek = new Date();
    mondayOfThisWeek.setDate(today.getDate() + offsetToMonday);

    const targetDate = new Date(mondayOfThisWeek);
    targetDate.setDate(mondayOfThisWeek.getDate() + (numDay - 1));
    
    return targetDate;
  };

  const formatFullDate = (dayIndex) => {
    const date = getDateForDay(dayIndex);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }); 
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    if (isNaN(day)) return 'Invalid Date';
    return `${weekday}, ${day} ${month}`;
  };

  const handleAddStream = () => {
    // Validation based on status
    if (formData.status === 'scheduled') {
      if (!formData.day || !formData.time || !formData.game) {
        alert('Please fill in all required fields (Day, Time, and Game)');
        return;
      }
    } else if (formData.status === 'nostream') {
      if (!formData.day) {
        alert('Please select a day');
        return;
      }
    }

    const dayNumber = parseInt(formData.day);
    const newSchedule = [...(streamSchedule || [])];
    
    // Check if this day already exists
    const existingIndex = newSchedule.findIndex(s => s.day === dayNumber);
    
    const entry = {
      id: editingId || (existingIndex > -1 ? newSchedule[existingIndex].id : Date.now()),
      day: dayNumber,
      time: formData.status === 'scheduled' ? formData.time : '',
      game: formData.status === 'scheduled' ? formData.game : 'No Stream',
      status: formData.status,
      timezone: formData.status === 'scheduled' ? formData.timezone : ''
    };

    if (editingId) {
      // Update the entry being edited
      const index = newSchedule.findIndex(s => s.id === editingId);
      if (index > -1) {
        newSchedule[index] = entry;
      }
    } else if (existingIndex > -1) {
      // Duplicate day exists - update it silently
      newSchedule[existingIndex] = entry;
    } else {
      // New entry for a new day
      newSchedule.push(entry);
    }

    setStreamSchedule(newSchedule);
    saveSchedule(newSchedule);
    resetForm();
  };

  const saveSchedule = (schedule) => {
    try {
      const userProfileKey = `socialProfile_${currentUser?.id}`;
      const existingProfile = localStorage.getItem(userProfileKey);
      if (existingProfile) {
        const profile = JSON.parse(existingProfile);
        profile.streamSchedule = schedule;
        localStorage.setItem(userProfileKey, JSON.stringify(profile));
      }
    } catch (e) {
      console.warn('Failed to save stream schedule:', e);
    }
  };

  const handleDeleteStream = (id) => {
    const newSchedule = streamSchedule.filter(s => s.id !== id);
    setStreamSchedule(newSchedule);
    saveSchedule(newSchedule);
  };

  const handleEditStream = (stream) => {
    setFormData(stream);
    setEditingId(stream.id);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      day: '',
      time: '',
      game: '',
      status: 'scheduled',
      timezone: 'UTC+1'
    });
    setEditingId(null);
    setShowAddModal(false);
  };

  // formatDate and getDayLabel removed — not used in this component

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const sortedSchedule = [...(streamSchedule || [])].sort((a, b) => a.day - b.day);

  return (
    <div className="stream-schedule-container">
      <div className="schedule-header">
        <button className="add-stream-btn" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Add Stream
        </button>
      </div>

      {sortedSchedule.length === 0 ? (
        <div className="schedule-empty">
          <p>No streams scheduled yet</p>
          <p>Click "Add Stream" to get started</p>
        </div>
      ) : (
        <div className="schedule-table">
          {sortedSchedule.map(stream => (
            <div key={stream.id} className="schedule-card">
              <div className="card-content">
                <div className="card-section date-section">
                  <span className="label">DATE</span>
                  <span className="value">{formatFullDate(stream.day)}</span>
                </div>
                <div className="card-section time-section">
                  <span className="label">TIME</span>
                  <span className="value">{formatTime(stream.time)} {stream.timezone}</span>
                </div>
                <div className="card-section game-section">
                  <span className="label">GAME</span>
                  <span className="value">{stream.game}</span>
                </div>
                <div className="card-section status-section">
                  <span className="label">STATUS</span>
                  <span className={`status-badge status-${stream.status}`}>
                    {stream.status === 'scheduled' ? '● Scheduled' : '● No Stream'}
                  </span>
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="card-edit-btn" 
                  onClick={() => handleEditStream(stream)}
                  title="Edit"
                >
                  <MdEdit />
                </button>
                <button 
                  className="card-btn delete-btn" 
                  onClick={() => handleDeleteStream(stream.id)}
                  title="Delete"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="schedule-modal-overlay" onClick={() => resetForm()}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal-header">
              <h4>{editingId ? 'Edit Stream' : 'Add New Stream'}</h4>
              <button className="schedule-modal-close" onClick={resetForm}>
                <MdClose />
              </button>
            </div>

            <div className="schedule-form">
              <div className="form-group">
                <label>
                  <FaCircleExclamation style={{ color: '#ec4899' }} /> Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="schedule-input"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="nostream">No Stream</option>
                </select>
              </div>

              {formData.status === 'scheduled' && (
                <>
                  <div className="form-group">
                    <label>
                      <FaCalendar style={{ color: '#3b82f6' }} /> Day *
                    </label>
                    <select
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                      className="schedule-input"
                    >
                      <option value="">Select a day</option>
                      {DAYS_OF_WEEK.map(({ day, label }) => (
                        <option key={day} value={day}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <FaClock style={{ color: '#8b5cf6' }} /> Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="schedule-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <MdPublic style={{ color: '#10b981' }} /> Timezone
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="schedule-input"
                    >
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <FaGamepad /> Game *
                    </label>
                    <select
                      value={formData.game}
                      onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                      className="schedule-input"
                    >
                      <option value="">Select a game</option>
                      {GAMES.map(game => (
                        <option key={game} value={game}>{game}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {formData.status === 'nostream' && (
                <div className="form-group">
                  <label>
                    <FaCalendar /> Day *
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="schedule-input"
                  >
                    <option value="">Select a day</option>
                    {DAYS_OF_WEEK.map(({ day, label }) => (
                      <option key={day} value={day}>{label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="schedule-modal-actions">
                <button className="schedule-btn-cancel" onClick={resetForm}>Cancel</button>
                <button className="schedule-btn-save" onClick={handleAddStream}>
                  {editingId ? 'Update' : 'Add'} Stream
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamSchedule;
