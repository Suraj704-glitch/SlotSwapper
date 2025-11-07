import mongoose from 'mongoose';
import Event from '../models/Event.js';
import SwapRequest from '../models/SwapRequest.js';

// @desc    Get all slots marked as SWAPPABLE (from other users)
// @route   GET /api/swap/swappable
export const getSwappableSlots = async (req, res) => {
  try {
    const slots = await Event.find({
      status: 'SWAPPABLE',
      user: { $ne: req.user._id }, // $ne = Not Equal
    }).populate('user', 'name email'); // Populate user info
    
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new swap request
// @route   POST /api/swap/request
export const requestSwap = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const requesterId = req.user._id;

  try {
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    // --- Start Validation ---
    if (!mySlot || !theirSlot) {
      return res.status(404).json({ message: 'One or both slots not found' });
    }
    if (mySlot.user.toString() !== requesterId.toString()) {
      return res.status(401).json({ message: 'Not authorized, not your slot' });
    }
    if (theirSlot.user.toString() === requesterId.toString()) {
      return res.status(400).json({ message: 'Cannot swap with yourself' });
    }
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'One or both slots are not swappable' });
    }
    // --- End Validation ---

    // Create the swap request
    const swapRequest = await SwapRequest.create({
      requester: requesterId,
      requestee: theirSlot.user,
      requesterSlot: mySlotId,
      requesteeSlot: theirSlotId,
      status: 'PENDING',
    });

    // Set both slots to SWAP_PENDING
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to a swap request (Accept or Reject)
// @route   POST /api/swap/response/:id
export const respondToSwap = async (req, res) => {
  const { accepted } = req.body; // { "accepted": true } or { "accepted": false }
  const swapRequestId = req.params.id;
  const requesteeId = req.user._id;

  const session = await mongoose.startSession(); // Start transaction

  try {
    let result;
    await session.withTransaction(async () => {
      const swapRequest = await SwapRequest.findById(swapRequestId).session(session);

      if (!swapRequest) {
        throw new Error('Swap request not found');
      }

      // **CRITICAL CHECK**: Ensure user is the one being asked
      if (swapRequest.requestee.toString() !== requesteeId.toString()) {
        throw new Error('Not authorized to respond to this request');
      }
      
      if (swapRequest.status !== 'PENDING') {
        throw new Error('This request has already been responded to');
      }

      const requesterSlot = await Event.findById(swapRequest.requesterSlot).session(session);
      const requesteeSlot = await Event.findById(swapRequest.requesteeSlot).session(session);

      if (!requesterSlot || !requesteeSlot) {
        throw new Error('One or both slots involved no longer exist');
      }
      
      if (accepted === true) {
        // --- ACCEPTED ---
        // 1. Swap the owners
        requesterSlot.user = requesteeId;
        requesteeSlot.user = swapRequest.requester;

        // 2. Set status back to BUSY
        requesterSlot.status = 'BUSY';
        requesteeSlot.status = 'BUSY';
        
        // 3. Update swap request
        swapRequest.status = 'ACCEPTED';
        
        result = { message: 'Swap accepted successfully' };

      } else {
        // --- REJECTED ---
        // 1. Set status back to SWAPPABLE
        requesterSlot.status = 'SWAPPABLE';
        requesteeSlot.status = 'SWAPPABLE';

        // 2. Update swap request
        swapRequest.status = 'REJECTED';
        
        result = { message: 'Swap rejected successfully' };
      }
      
      // Save all changes in the transaction
      await swapRequest.save({ session });
      await requesterSlot.save({ session });
      await requesteeSlot.save({ session });
    });
    
    session.endSession();
    res.status(200).json(result);

  } catch (error) {
    session.endSession();
    res.status(400).json({ message: error.message || 'Transaction failed' });
  }
};

// @desc    Get all incoming and outgoing swap requests for the user
// @route   GET /api/swap/me
export const getMySwapRequests = async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ 
      requestee: req.user._id,
      status: 'PENDING' 
    })
      .populate('requester', 'name email')
      .populate('requesterSlot', 'title startTime endTime')
      .populate('requesteeSlot', 'title startTime endTime');
      
    const outgoing = await SwapRequest.find({ requester: req.user._id })
      .populate('requestee', 'name email')
      .populate('requesterSlot', 'title startTime endTime')
      .populate('requesteeSlot', 'title startTime endTime');
      
    res.json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};