import Member from '../models/Member.js';

/**
 * @desc    Create new member
 * @route   POST /api/members
 * @access  Private (Admin/Librarian)
 */
export const createMember = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const member = await Member.create({
      name,
      email,
      phone,
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get all members
 * @route   GET /api/members
 * @access  Private
 */
export const getMembers = async (req, res) => {
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
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
        ],
      };
    }

    const total = await Member.countDocuments(query);
    const members = await Member.find(query)
      .sort({ membershipDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      members,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMembers: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single member by ID
 * @route   GET /api/members/:id
 * @access  Private
 */
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update member
 * @route   PUT /api/members/:id
 * @access  Private (Admin/Librarian)
 */
export const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    Object.assign(member, req.body);
    const updatedMember = await member.save();

    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete member
 * @route   DELETE /api/members/:id
 * @access  Private (Admin only)
 */
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await member.deleteOne();

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
