import Event from '../models/Event.js';

// @desc    Create a new event
// @route   POST /api/events
export const createEvent = async (req, res) => {
  const { title, startTime, endTime } = req.body;

  try {
    const event = new Event({
      title,
      startTime,
      endTime,
      user: req.user._id, // req.user comes from the 'protect' middleware
      status: 'BUSY',
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all of the logged-in user's events
// @route   GET /api/events/me
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).sort({ startTime: 'asc' });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event's status (e.g., BUSY -> SWAPPABLE)
// @route   PUT /api/events/:id/status
export const updateEventStatus = async (req, res) => {
  const { status } = req.body; // Expecting { "status": "SWAPPABLE" }

  // Basic validation
  if (status !== 'BUSY' && status !== 'SWAPPABLE') {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // **CRITICAL SECURITY CHECK**: Ensure the user owns this event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Can't change status if a swap is already pending
    if (event.status === 'SWAP_PENDING') {
      return res.status(400).json({ message: 'Cannot change status of a pending swap' });
    }

    event.status = status;
    const updatedEvent = await event.save();
    res.json(updatedEvent);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};