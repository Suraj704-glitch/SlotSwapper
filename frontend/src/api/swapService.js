import axios from 'axios';

// The base URL and auth token are already set by AuthContext.js

/**
 * Fetches all swappable slots from OTHER users
 */
export const getSwappableSlots = async () => {
  try {
    const res = await axios.get('/swap/swappable');
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch swappable slots');
  }
};

/**
 * Creates a new swap request
 * @param {string} mySlotId - The ID of the user's slot they are offering
 * @param {string} theirSlotId - The ID of the slot they want
 */
export const requestSwap = async (mySlotId, theirSlotId) => {
  try {
    const res = await axios.post('/swap/request', { mySlotId, theirSlotId });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to create swap request');
  }
};

/**
 * Fetches all incoming and outgoing swap requests for the user
 */
export const getMySwapRequests = async () => {
  try {
    const res = await axios.get('/swap/me');
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch swap requests');
  }
};
// ... (keep getSwappableSlots, requestSwap, getMySwapRequests) ...

/**
 * Responds to a swap request (Accepts or Rejects)
 * @param {string} requestId - The ID of the swap request
 * @param {boolean} accepted - true to accept, false to reject
 */
export const respondToSwap = async (requestId, accepted) => {
  try {
    const res = await axios.post(`/swap/response/${requestId}`, { accepted });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to respond to swap');
  }
};