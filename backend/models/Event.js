import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Connects this event to a User
    ref: 'User', // The model to use for the relationship
    required: true,
    index: true, // Adds an index for faster queries by user
  },
  title: {
    type: String,
    required: [true, 'Event must have a title'],
    trim: true,
  },
  startTime: {
    type: Date,
    required: [true, 'Event must have a start time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Event must have an end time'],
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
      message: '{VALUE} is not a supported status',
    },
    default: 'BUSY',
  },
}, { timestamps: true });

// Ensures a user cannot have two events at the exact same time (optional but good)
// eventSchema.index({ user: 1, startTime: 1 }, { unique: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;