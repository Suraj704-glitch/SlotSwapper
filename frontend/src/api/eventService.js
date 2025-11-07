import axios from 'axios';

// The base URL and auth token are already set by AuthContext.js

/**
 * Fetches all events for the currently logged-in user
 */
export const getMyEvents = async () => {
  try {
    const res = await axios.get('/events/me');
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch events');
  }
};

/**
 * Creates a new event
 * @param {Object} eventData - { title, startTime, endTime }
 */
export const createEvent = async (eventData) => {
  try {
    const res = await axios.post('/events', eventData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to create event');
  }
};

/**
 * Updates an event's status
 * @param {string} eventId - The ID of the event to update
 * @param {string} status - The new status ("BUSY" or "SWAPPABLE")
 */
export const updateEventStatus = async (eventId, status) => {
  try {
    const res = await axios.put(`/events/${eventId}/status`, { status });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to update status');
  }
};