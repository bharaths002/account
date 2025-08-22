import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const router = express.Router();

// Nodemailer transporter setup to send emails
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use 'true' for port 465, 'false' for other ports
    auth: {
        user: 'candace44@ethereal.email',
        pass: 'Gm3xR4HSU2evHSeSEp',
    },
});

// @route   POST /auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.verificationToken = verificationToken;

        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Please verify your email',
            html: `<p>Click this link to verify your email: <a href="${process.env.BASE_URL}/verify/${verificationToken}">Verify Email</a></p>`,
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json({ msg: 'Please verify your email.' });
    } catch (err) {
        console.log('--- A SERVER ERROR OCCURRED ---');
        console.log(err);
        res.status(500).send('Server error');
    }
});

// @route   POST /auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ msg: 'Please verify your email to log in.' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /auth/verify/:token
// @desc    Verify a user's email
router.get('/verify/:token', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).send('Invalid verification token.');
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).send('Email verified successfully!');
    } catch (err) {
        console.error(err.message);
        res.status(400).send('Invalid or expired verification token.');
    }
});

// @route   POST /auth/forgot-password
// @desc    Send password reset link to user's email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User with that email does not exist.' });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 900000;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `<p>Click this link to reset your password: <a href="${process.env.BASE_URL}/reset/${resetToken}">Reset Password</a></p>`,
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: 'Reset link sent to your email.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /auth/reset-password/:token
// @desc    Reset user's password using the token
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ msg: 'Password reset token is invalid or has expired.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ msg: 'Password has been reset successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;