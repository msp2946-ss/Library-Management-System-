import Book from '../models/Book.js';

/**
 * @desc    Create new book
 * @route   POST /api/books
 * @access  Private (Admin/Librarian)
 */
export const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies } = req.body;

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      totalCopies,
      availableCopies: totalCopies, // Initially all copies are available
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get all books with search and pagination
 * @route   GET /api/books
 * @access  Private
 */
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search functionality
    let query = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = {
        $or: [
          { title: searchRegex },
          { author: searchRegex },
          { category: searchRegex },
        ],
      };
    }

    // Filter by category
    if (req.query.category) {
      query.category = new RegExp(req.query.category, 'i');
    }

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single book by ID
 * @route   GET /api/books/:id
 * @access  Private
 */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update book
 * @route   PUT /api/books/:id
 * @access  Private (Admin/Librarian)
 */
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update fields
    Object.assign(book, req.body);

    // Ensure availableCopies doesn't exceed totalCopies
    if (book.availableCopies > book.totalCopies) {
      book.availableCopies = book.totalCopies;
    }

    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete book
 * @route   DELETE /api/books/:id
 * @access  Private (Admin only)
 */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();

    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get book statistics for dashboard
 * @route   GET /api/books/stats
 * @access  Private
 */
export const getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$availableCopies' },
        },
      },
    ]);

    res.json({
      totalBooks,
      availableCopies: availableBooks[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
