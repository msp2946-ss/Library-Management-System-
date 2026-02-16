import Issue from '../models/Issue.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import { sendBookIssueEmail, sendBookReturnEmail } from '../utils/emailService.js';

/**
 * @desc    Issue a book to a member
 * @route   POST /api/issues
 * @access  Private (Admin/Librarian)
 */
export const issueBook = async (req, res) => {
  try {
    const { bookId, memberId } = req.body;

    // Validate book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Validate member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for this book' });
    }

    // Check if member already has this book issued (prevent duplicate)
    const existingIssue = await Issue.findOne({
      book: bookId,
      member: memberId,
      status: 'issued',
    });

    if (existingIssue) {
      return res.status(400).json({ message: 'This book is already issued to this member' });
    }

    // Create issue record
    const issue = await Issue.create({
      book: bookId,
      member: memberId,
      issuedBy: req.user._id,
    });

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    // Populate the issue data for response
    const populatedIssue = await Issue.findById(issue._id)
      .populate('book', 'title author isbn')
      .populate('member', 'name email')
      .populate('issuedBy', 'name');

    // Send email notification (async - don't wait)
    sendBookIssueEmail(member.email, member.name, book.title, issue.issueDate);

    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Return a book
 * @route   PUT /api/issues/:id/return
 * @access  Private (Admin/Librarian)
 */
export const returnBook = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('book')
      .populate('member');

    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    if (issue.status === 'returned') {
      return res.status(400).json({ message: 'Book has already been returned' });
    }

    // Update issue status
    issue.status = 'returned';
    issue.returnDate = Date.now();
    await issue.save();

    // Increase available copies
    const book = await Book.findById(issue.book._id);
    book.availableCopies += 1;
    await book.save();

    // Send return confirmation email
    sendBookReturnEmail(
      issue.member.email,
      issue.member.name,
      issue.book.title,
      issue.returnDate
    );

    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get all issues with filters
 * @route   GET /api/issues
 * @access  Private
 */
export const getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by member
    if (req.query.memberId) {
      query.member = req.query.memberId;
    }

    // Filter by book
    if (req.query.bookId) {
      query.book = req.query.bookId;
    }

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .populate('book', 'title author isbn')
      .populate('member', 'name email')
      .populate('issuedBy', 'name')
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      issues,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalIssues: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single issue by ID
 * @route   GET /api/issues/:id
 * @access  Private
 */
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('book', 'title author isbn')
      .populate('member', 'name email phone')
      .populate('issuedBy', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get issue statistics for dashboard
 * @route   GET /api/issues/stats/dashboard
 * @access  Private
 */
export const getIssueStats = async (req, res) => {
  try {
    const totalIssued = await Issue.countDocuments({ status: 'issued' });
    const totalReturned = await Issue.countDocuments({ status: 'returned' });

    // Get recently issued books (last 5)
    const recentIssues = await Issue.find({ status: 'issued' })
      .populate('book', 'title author')
      .populate('member', 'name')
      .sort({ issueDate: -1 })
      .limit(5);

    res.json({
      totalIssued,
      totalReturned,
      recentIssues,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete issue record
 * @route   DELETE /api/issues/:id
 * @access  Private (Admin only)
 */
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    await issue.deleteOne();

    res.json({ message: 'Issue record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
