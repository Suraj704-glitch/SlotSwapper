import React, { useState, useEffect } from 'react';
import { getSwappableSlots, requestSwap } from '../api/swapService';
import { getMyEvents } from '../api/eventService'; // We need our own events
import Modal from '../components/Modal'; // Import the Modal
import { format } from 'date-fns';

// --- Simple styling (optional) ---
const pageStyle = { padding: '20px' };
const listStyle = { listStyle: 'none', padding: 0 };
const itemStyle = {
  border: '1px solid #eee',
  padding: '15px',
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const mySlotItemStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  margin: '5px 0',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#f0f0f0',
  }
};

// --- Main Component ---
const MarketplacePage = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // The slot they WANT
  const [mySelectedSlotId, setMySelectedSlotId] = useState(null); // The slot I'm OFFERING
  const [modalError, setModalError] = useState(null);

  // --- 1. Fetch data on component load ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all swappable slots from other users
        const slots = await getSwappableSlots();
        setAvailableSlots(slots);
        
        // Fetch my own events to find which ones I can offer
        const myEvents = await getMyEvents();
        setMySwappableSlots(myEvents.filter(event => event.status === 'SWAPPABLE'));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. Modal Handlers ---
  const openSwapModal = (slot) => {
    setSelectedSlot(slot); // Store the slot they clicked on
    setModalError(null);
    setMySelectedSlotId(null); // Reset my selection
    setShowModal(true);
  };

  const closeSwapModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  // --- 3. Swap Request Handler ---
  const handleSwapRequest = async () => {
    if (!mySelectedSlotId) {
      setModalError('You must select one of your slots to offer.');
      return;
    }
    setModalError(null);

    try {
      await requestSwap(mySelectedSlotId, selectedSlot._id);
      
      // Success!
      closeSwapModal();
      
      // Remove the slot from the marketplace view
      setAvailableSlots(prev => prev.filter(s => s._id !== selectedSlot._id));
      
      // (Optional but good) Update my local event state to 'SWAP_PENDING'
      setMySwappableSlots(prev => prev.filter(s => s._id !== mySelectedSlotId));

    } catch (err) {
      setModalError(err.message);
    }
  };

  // --- Helper to format date (requires date-fns) ---
  const formatEventDate = (dateStr) => {
    return format(new Date(dateStr), 'MMM dd, yyyy @ h:mm a');
  };

  return (
    <div style={pageStyle}>
      <h1>Marketplace</h1>
      <p>Here are all the slots available for swapping.</p>
      
      {loading && <p>Loading available slots...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul style={listStyle}>
        {availableSlots.length === 0 && !loading && (
          <p>No swappable slots available right now.</p>
        )}
        {availableSlots.map((slot) => (
          <li key={slot._id} style={itemStyle}>
            <div>
              <strong>{slot.title}</strong> (from {slot.user?.name || 'User'})
              <p>
                {formatEventDate(slot.startTime)} to {formatEventDate(slot.endTime)}
              </p>
            </div>
            <button onClick={() => openSwapModal(slot)}>
              Request Swap
            </button>
          </li>
        ))}
      </ul>

      {/* --- The Swap Request Modal --- */}
      <Modal show={showModal} onClose={closeSwapModal} title="Request a Swap">
        {selectedSlot && (
          <div>
            <p>You are requesting:</p>
            <h4>{selectedSlot.title}</h4>
            <p>{formatEventDate(selectedSlot.startTime)} to {formatEventDate(selectedSlot.endTime)}</p>
            <hr />
            <p><strong>Choose one of your swappable slots to offer:</strong></p>
            {mySwappableSlots.length === 0 ? (
              <p>You have no swappable slots to offer. Go to your Dashboard to add one.</p>
            ) : (
              mySwappableSlots.map(mySlot => (
                <div
                  key={mySlot._id}
                  style={{
                    ...mySlotItemStyle,
                    backgroundColor: mySelectedSlotId === mySlot._id ? '#d0e0ff' : '#fff'
                  }}
                  onClick={() => setMySelectedSlotId(mySlot._id)}
                >
                  <strong>{mySlot.title}</strong>
                  <p>{formatEventDate(mySlot.startTime)}</p>
                </div>
              ))
            )}
            
            <br />
            {modalError && <p style={{ color: 'red' }}>{modalError}</p>}
            
            <button 
              onClick={handleSwapRequest}
              disabled={!mySelectedSlotId || mySwappableSlots.length === 0}
              style={{ padding: '10px 15px', width: '100%' }}
            >
              Send Swap Request
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MarketplacePage;