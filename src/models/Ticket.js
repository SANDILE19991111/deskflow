const mongoose = require('mongoose');

const PRIORITY_VALUES = ['Low', 'Medium', 'High'];
const STATUS_VALUES = ['Open', 'In Progress', 'Resolved'];

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITY_VALUES,
        message: '{VALUE} is not a valid priority (Low, Medium, High)',
      },
      required: [true, 'Priority is required'],
    },
    status: {
      type: String,
      enum: {
        values: STATUS_VALUES,
        message: '{VALUE} is not a valid status',
      },
      default: 'Open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

ticketSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
module.exports.PRIORITY_VALUES = PRIORITY_VALUES;
module.exports.STATUS_VALUES = STATUS_VALUES;
