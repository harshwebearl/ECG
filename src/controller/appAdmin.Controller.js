import AppAdmin from '../models/appAdminModel.js';
import User from '../models/userModel.js';
import AddedUser from '../models/userAddModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: '1d',
    });
};

// ✅ Sign In (bcrypt)
const appAdminSignIn = async (req, res) => {
    const { email, phoneNumber, password } = req.body;

    try {
        const user = await AppAdmin.findOne({ $or: [{ email }, { phoneNumber }] });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email/phone number or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email/phone number or password' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            phoneNumber: user.phoneNumber,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

// ✅ Change Password (bcrypt)
const appAdminchangePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await AppAdmin.findById(req.user._id); // Use _id for consistency
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Other unchanged functions...
const getappAdminProfile = async (req, res) => {
    try {
        const user = await AppAdmin.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({
            _id: user._id,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Admin profile' });
    }
};

const updateappAdminProfile = async (req, res) => {
    const { email, phoneNumber } = req.body;
    try {
        const user = await AppAdmin.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        await user.save();
        res.status(200).json({
            _id: user._id,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

const getAllUser = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            totalUsers: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Read all failed",
            error: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Read failed", error: error.message });
    }
};

const userStatusUpdate = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'blocked'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value. Must be either 'active' or 'blocked'"
            });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: `User ${status === 'blocked' ? 'blocked' : 'activated'} successfully`,
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user status",
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteUser)
            return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
};

const getUserWithFamilyById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Main user not found',
            });
        }
        const familyMembers = await AddedUser.find({ createdBy: user._id });
        res.status(200).json({
            success: true,
            data: {
                mainUser: {
                    id: user._id,
                    full_name: user.full_name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    age: user.age,
                    gender: user.gender,
                    weight: user.weight,
                    height: user.height,
                    status: user.status,
                },
                familyMembers: familyMembers.map(member => ({
                    id: member._id,
                    full_name: member.full_name,
                    relation: member.relation,
                    age: member.age,
                    gender: member.gender,
                    weight: member.weight,
                    height: member.height,
                }))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

export {
    appAdminSignIn,
    getappAdminProfile,
    updateappAdminProfile,
    appAdminchangePassword,
    getAllUser,
    getUserById,
    userStatusUpdate,
    getUserWithFamilyById,
    deleteUser
};
