import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requesterSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  requesteeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
    index: true, // Add index for faster queries by status
  },
}, { timestamps: true });

// Index to help find all requests for a specific user (either as requester or requestee)
swapRequestSchema.index({ requester: 1 });
swapRequestSchema.index({ requestee: 1 });

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
export default SwapRequest;