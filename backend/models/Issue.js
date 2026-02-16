import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Please provide book ID'],
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Please provide member ID'],
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['issued', 'returned'],
    default: 'issued',
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Create compound index to prevent duplicate active issues
issueSchema.index({ book: 1, member: 1, status: 1 });

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
