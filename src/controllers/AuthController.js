import { body } from "express-validator";
import { User } from "../models/User.js";
import { succeed, ValidationError } from "../utils/error.js";

const registerQueryValidator = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .custom(async (value) => {
            const user = await User.findOne({ username: value });
            if (user) {
                throw new Error('Username already in use');
            }
        }),
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

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password: password });
        await newUser.save();
        succeed(res, 201, { message: "Register success" })
    } catch (err) {
        next(err);
    }
}

const loginQueryValidator = [
    body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
];

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new ValidationError("Invalid credentials");
        }
        const isMatch = password == user.password;
        if (!isMatch) {
            throw new ValidationError("Invalid credentials");
        }
        req.session.userId = user._id;
        req.session.username = user.username;

        succeed(res, 200, {
            message: "Login successful",
            redirectTo: "/products"
        })

    } catch (err) {
        next(err);
    }
};


export { register, registerQueryValidator, login, loginQueryValidator, }