import User from '../models/User.js';
import AlumniProfile from '../models/AlumniProfile.js';
import StudentProfile from '../models/StudentProfile.js';

// @desc    Get all users with profiles
// @route   GET /api/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
    try {
        const { role, search, page = 1, limit = 50 } = req.query;

        const query = {};

        if (role) {
            query.role = role;
        }

        if (search) {
            query.email = { $regex: search, $options: 'i' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await User.countDocuments(query);

        const users = await User.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        // Enrich with profile data
        const enrichedUsers = await Promise.all(
            users.map(async (user) => {
                const userData = user.toObject();
                if (user.role === 'Alumni') {
                    userData.profile = await AlumniProfile.findOne({ userId: user._id });
                } else if (user.role === 'Student') {
                    userData.profile = await StudentProfile.findOne({ userId: user._id });
                }
                return userData;
            })
        );

        res.json({
            success: true,
            data: {
                users: enrichedUsers,
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.role === 'Admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot deactivate admin accounts',
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user and their profile
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.role === 'Admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete admin accounts',
            });
        }

        // Delete associated profile
        if (user.role === 'Alumni') {
            await AlumniProfile.findOneAndDelete({ userId: user._id });
        } else if (user.role === 'Student') {
            await StudentProfile.findOneAndDelete({ userId: user._id });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'User and profile deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
