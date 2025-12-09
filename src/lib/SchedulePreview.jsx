import React, { useEffect, useState } from 'react';
import '../styles/SchedulePreview.css';
import { FaXmark } from 'react-icons/fa6';
import { GrScheduleNew } from 'react-icons/gr';

const SchedulePreview = ({ streamSchedule, isScheduleVisible, setIsScheduleVisible }) => {
  const [, setRefresh] = useState(0);

  useEffect(() => {
    // Check if date changed at midnight
    const checkDateChange = () => {
      const now = new Date();
      const msUntilMidnight = (24 - now.getHours()) * 60 * 60 * 1000 - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000;
      
      const timer = setTimeout(() => {
        setRefresh(prev => prev + 1);
        checkDateChange(); // Reschedule for next midnight
      }, msUntilMidnight);

      return () => clearTimeout(timer);
    };

    return checkDateChange();
  }, []);

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

  // formatFullDate removed — not used in this component
  if (!streamSchedule || streamSchedule.length === 0) {
    return null;
  }

  const upcomingStreams = [...streamSchedule]
    .sort((a, b) => a.day - b.day);

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // getDayName removed — not used in this component

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
        <div className="schedule-preview-header" style={{ position: 'relative', width: '100%' }}>
          <h3 className="schedule-preview-title">
            <GrScheduleNew className="schedule-title-icon" />
            Stream Schedule
          </h3>
          <button
            className="schedule-close-btn"
            onClick={() => setIsScheduleVisible(false)}
            title="Close schedule"
            style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', left: 'auto' }}
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
          <GrScheduleNew />
        </button>
      )}

      {isScheduleVisible && (
        <div className="schedule-preview-list">
          <div className="schedule-preview-header-row">
            <span className="schedule-header-cell">Day</span>
            <span className="schedule-header-cell">Game</span>
            <span className="schedule-header-cell">Time</span>
            <span className="schedule-header-cell">Timezone</span>
            <span className="schedule-header-cell">Status</span>
          </div>
          {upcomingStreams.map((stream) => {
            const date = getDateForDay(stream.day);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            return (
            <div key={stream.id} className="schedule-preview-item">
              <div className="schedule-cell day-cell">
                <span>{dateStr}</span>
              </div>

              <div className="schedule-cell game-cell">
                {stream.status === 'scheduled' ? (
                  <span>{stream.game}</span>
                ) : (
                  <span></span>
                )}
              </div>

              <div className="schedule-cell time-cell">
                {stream.status === 'scheduled' ? (
                  <span>{formatTime(stream.time)}</span>
                ) : (
                  <span></span>
                )}
              </div>

              <div className="schedule-cell timezone-cell">
                {stream.status === 'scheduled' ? (
                  <span>{stream.timezone}</span>
                ) : (
                  <span></span>
                )}
              </div>

              <div className="schedule-cell status-cell">
                <span className={`schedule-status-badge status-${stream.status}`}>
                  {stream.status === 'scheduled' ? 'Streaming' : 'No Stream'}
                </span>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SchedulePreview;
