const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ status: false, message: 'Email, password, and confirm password are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ status: false, message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ status: false, message: 'Password must be at least 6 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ status: false, message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, message: 'Email already registered' });
    }

    const user = await User.create({ email, password });
    const token = createToken(user.email, user._id);

    res.cookie('token', token, {
      maxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    return res.status(201).json({
      status: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ status: false, message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: 'User is not registered' });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ status: false, message: 'Password is incorrect' });
    }

    const token = createToken(user.email, user._id);

    res.cookie('token', token, {
      maxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    return res.status(200).json({
      status: true,
      message: 'Login successfully',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    return res.status(200).json({ status: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ status: false, message: 'Email is required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ status: false, message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not registered' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password',
      text: `${process.env.ORIGIN}/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ status: false, message: 'Error sending email' });
      }
      return res.status(200).json({ status: true, message: 'Email sent successfully' });
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ status: false, message: 'Password is required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ status: false, message: 'Password must be at least 6 characters' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({ status: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(401).json({ status: false, message: 'Invalid or expired token' });
  }
};

const getAuthenticatedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
    return res.status(200).json({
      status: true,
      message: 'Authorized',
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

module.exports = { signup, signin, logout, forgotPassword, resetPassword, getAuthenticatedUser };