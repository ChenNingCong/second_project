import { body } from "express-validator";
import { User } from "../models/User.js";

const registerQueryValidator = [
    // Username check
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .custom(async (value) => {
            const user = await User.findOne({ username: value });
            if (user) {
                throw new Error('Username already in use');
            }
        }),

    // Email check
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('E-mail already in use');
            }
        }),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password: password });
        await newUser.save();

        // Success response
        res.status(201).json({ message: "Success" });
    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
}

const loginQueryValidator = [
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 2. Check Password (Assuming you used bcrypt to hash during registration)
        const isMatch = password == user.password;
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 3. Set Session Data
        req.session.userId = user._id;
        req.session.username = user.username;

        // 4. Redirect
        // For API/AJAX requests, you might send a URL; 
        // For standard form submissions, use res.redirect
        res.status(200).json({ 
            message: "Login successful", 
            redirectTo: "/products" 
        });

    } catch (err) {
        res.status(500).json({ error: "Login server error" });
    }
};


export { register, registerQueryValidator, login, loginQueryValidator,  }