import React from 'react';
import '../styles/SchedulePreview.css';
import { FaClock, FaGamepad, FaXmark } from 'react-icons/fa6';
import { CiStreamOn } from 'react-icons/ci';

const SchedulePreview = ({ streamSchedule, isScheduleVisible, setIsScheduleVisible }) => {
  if (!streamSchedule || streamSchedule.length === 0) {
    return null;
  }

  const upcomingStreams = [...streamSchedule]
    .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
    .slice(0, 5);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isToday = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateStr) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(dateStr);
    return date.toDateString() === tomorrow.toDateString();
  };

  const getDateLabel = (dateStr) => {
    if (isToday(dateStr)) return 'Today';
    if (isTomorrow(dateStr)) return 'Tomorrow';
    return formatDate(dateStr);
  };

  return (
    <div 
      className={`schedule-preview-container ${isScheduleVisible ? 'expanded' : 'collapsed'}`}
      style={{
        position: 'fixed',
        top: '220px',
        left: '20px',
        zIndex: 10,
      }}
    >
      {isScheduleVisible && (
        <div className="schedule-preview-header">
          <h3 className="schedule-preview-title">
            <CiStreamOn className="schedule-title-icon" />
            Stream Schedule
          </h3>
          <button
            className="schedule-close-btn"
            onClick={() => setIsScheduleVisible(false)}
            title="Close schedule"
          >
            <FaXmark />
          </button>
        </div>
      )}

      {!isScheduleVisible && (
        <button
          className="schedule-toggle-btn"
          onClick={() => setIsScheduleVisible(true)}
          title="Show schedule"
        >
          <CiStreamOn />
        </button>
      )}

      {isScheduleVisible && (
        <div className="schedule-preview-list">
          {upcomingStreams.map((stream) => (
            <div key={stream.id} className="schedule-preview-item">
              <div className="schedule-date-badge">
                <span className="schedule-date">{getDateLabel(stream.date)}</span>
              </div>
              
              <div className="schedule-game">
                <FaGamepad className="schedule-icon-game" />
                <span>{stream.game}</span>
              </div>

              <div className="schedule-time">
                <FaClock className="schedule-icon-time" />
                <span>{stream.time} {stream.timezone}</span>
              </div>

              <span className={`schedule-status-badge status-${stream.status}`}>
                {stream.status === 'scheduled' ? '🔴 Streaming' : '⭕ No Stream'}
              </span>
            </div>
          ))}

          {streamSchedule.length > 5 && (
            <div className="schedule-preview-more">
              <p>+{streamSchedule.length - 5} more streams scheduled</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchedulePreview;
