import React, { useState, useEffect } from 'react';
import { getMySwapRequests, respondToSwap } from '../api/swapService';
import { format } from 'date-fns';

// --- Simple styling (optional) ---
const pageStyle = { padding: '20px' };
const listContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '20px',
};
const listStyle = { listStyle: 'none', padding: 0, width: '48%' };
const itemStyle = {
  border: '1px solid #eee',
  padding: '15px',
  marginBottom: '10px',
  borderRadius: '8px',
};
const buttonGroupStyle = { marginTop: '10px', display: 'flex', gap: '10px' };

// --- Main Component ---
const RequestsPage = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. Fetch data on component load ---
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMySwapRequests();
      // Filter incoming to only show pending ones
      setIncoming(data.incoming.filter(req => req.status === 'PENDING'));
      setOutgoing(data.outgoing);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Action Handlers (Accept/Reject) ---
  const handleResponse = async (requestId, accepted) => {
    try {
      // Call the API
      await respondToSwap(requestId, accepted);
      
      // Update the UI immediately by removing the request from the list
      setIncoming(prev => prev.filter(req => req._id !== requestId));
      
      // Optional: You could also refetch all data
      // fetchRequests(); 
      // But filtering is faster and gives instant feedback
      
    } catch (err) {
      setError(err.message); // Show an error if the API call fails
    }
  };

  // --- Helper to format date (requires date-fns) ---
  const formatEventDate = (dateStr) => {
    return format(new Date(dateStr), 'MMM dd, yyyy @ h:mm a');
  };

  // --- Helper component for rendering a single slot (to avoid repetition) ---
  const SlotInfo = ({ title, slot }) => (
    <div>
      <strong>{title}</strong>
      <p>{slot.title}</p>
      <p style={{ fontSize: '0.9em', color: '#555' }}>
        {formatEventDate(slot.startTime)} to {formatEventDate(slot.endTime)}
      </p>
    </div>
  );

  return (
    <div style={pageStyle}>
      <h1>Your Swap Requests</h1>
      {loading && <p>Loading requests...</p>}
      {error && <p style={{ color: 'red', border: '1Epx solid red', padding: '10px' }}>Error: {error}</p>}
      
      <div style={listContainerStyle}>
        
        {/* --- INCOMING REQUESTS --- */}
        <div style={listStyle}>
          <h2>Incoming Requests</h2>
          {incoming.length === 0 && !loading && (
            <p>You have no pending incoming requests.</p>
          )}
          {incoming.map((req) => (
            <li key={req._id} style={itemStyle}>
              <p><strong>From:</strong> {req.requester.name}</p>
              <hr />
              <SlotInfo title="They want your slot:" slot={req.requesteeSlot} />
              <SlotInfo title="And are offering:" slot={req.requesterSlot} />
              <div style={buttonGroupStyle}>
                <button 
                  onClick={() => handleResponse(req._id, true)}
                  style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 12px', border: 'none' }}
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleResponse(req._id, false)}
                  style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', border: 'none' }}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </div>

        {/* --- OUTGOING REQUESTS --- */}
        <div style={listStyle}>
          <h2>Outgoing Requests</h2>
          {outgoing.length === 0 && !loading && (
            <p>You have no outgoing requests.</p>
          )}
          {outgoing.map((req) => (
            <li key={req._id} style={{ ...itemStyle, backgroundColor: '#f9f9f9' }}>
              <p><strong>To:</strong> {req.requestee.name}</p>
              <p><strong>Status:</strong> <strong style={{ 
                color: req.status === 'PENDING' ? '#ffc107' : req.status === 'ACCEPTED' ? '#28a745' : '#dc3545' 
              }}>{req.status}</strong></p>
              <hr />
              <SlotInfo title="You offered:" slot={req.requesterSlot} />
              <SlotInfo title="You requested:" slot={req.requesteeSlot} />
            </li>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default RequestsPage;