const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { isEmailValid } = require('../helper/helper');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, username, email, password } = req.body;
	// can do this in front-end
	if (!name || !username || !email || !password) {
		res.status(400);
		throw new Error('Please add all fields');
	}
	if (!isEmailValid(email)) {
		res.status(400);
		throw new Error('Enter a valid email');
	}
	// Check if user exists
	const emailExists = await User.findOne({ email });
	const usernameExists = await User.findOne({ username });

	if (emailExists) {
		res.status(400);
		throw new Error('Email already exists');
	}

	if (usernameExists) {
		res.status(400);
		throw new Error('Username already exists');
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create user
	const user = await User.create({
		name,
		username,
		email,
		password: hashedPassword,
	});

	if (user) {
		res.status(201).json({
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		res.status(400);
		throw new Error('Please add all fields!');
	}

	// Check for user email
	const user = await User.findOne({ username });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.json({
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid credentials');
	}
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
	res.status(200).json(req.user);
});

// Generate JWT
const generateToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

module.exports = {
	registerUser,
	loginUser,
	getMe,
};
