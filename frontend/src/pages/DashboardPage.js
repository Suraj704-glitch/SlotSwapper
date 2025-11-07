import React, { useState, useEffect } from 'react';
import { getMyEvents, createEvent, updateEventStatus } from '../api/eventService';
import { format } from 'date-fns';
import './DashboardPage.css'; // <-- 1. CSS IMPORT KAREIN

const DashboardPage = () => {
  // State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [formError, setFormError] = useState(null);

  // 1. Fetch data on load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getMyEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Create Event Handler
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!title || !startTime || !endTime) {
      setFormError('All fields are required');
      return;
    }
    try {
      const newEvent = await createEvent({ title, startTime, endTime });
      setEvents([newEvent, ...events]); // Naya event list mein sabse upar
      // Form clear karein
      setTitle('');
      setStartTime('');
      setEndTime('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  // 3. Toggle Status Handler
  const handleToggleStatus = async (event) => {
    try {
      const newStatus = event.status === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
      const updatedEvent = await updateEventStatus(event._id, newStatus);
      setEvents(events.map(e => (e._id === updatedEvent._id ? updatedEvent : e)));
    } catch (err) {
      console.error('Failed to update status:', err);
      // Yahan error dikha sakte hain
    }
  };

  // 4. Date format helper
  const formatEventDate = (dateStr) => {
    return format(new Date(dateStr), 'MMM dd, yyyy @ h:mm a');
  };

  return (
    <div className="dashboard-page">
      <h1>Your Dashboard</h1>
      {error && <p className="error-message">{error}</p>}

      {/* --- Create Event Card --- */}
      <div className="dashboard-card">
        <h2>Create New Event</h2>
        <form onSubmit={handleCreateEvent} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              className="form-input"
              placeholder="e.g., Team Meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="datetime-local"
              id="startTime"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="datetime-local"
              id="endTime"
              className="form-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <button type="submit" className="form-button">Create Event</button>
          {formError && <p className="error-message">{formError}</p>}
        </form>
      </div>

      {/* --- Event List Card --- */}
      <div className="dashboard-card">
        <h2>Your Events</h2>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <ul className="event-list">
            {events.length === 0 ? (
              <p>You have no events. Create one above!</p>
            ) : (
              events.map((event) => (
                <li key={event._id} className="event-item">
                  <div className="event-details">
                    <p><strong>{event.title}</strong></p>
                    <p>{formatEventDate(event.startTime)} to {formatEventDate(event.endTime)}</p>
                    <p>
                      <span className={`event-status status-${event.status}`}>{event.status}</span>
                    </p>
                  </div>
                  <div className="event-actions">
                    {event.status !== 'SWAP_PENDING' ? (
                      <button
                        onClick={() => handleToggleStatus(event)}
                        className={event.status === 'SWAPPABLE' ? 'busy-button' : ''}
                      >
                        {event.status === 'BUSY' ? 'Make Swappable' : 'Make Busy'}
                      </button>
                    ) : (
                      <span className="pending-text">Swap Pending...</span>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;