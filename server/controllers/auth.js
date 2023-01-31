import User from "../models/user.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            password,
            email,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile,
            impressions
        } = req.body;

        if (!firstName) {
            return res.status(400).json("Please Enter your first name!")
        } else if (!email) {
            return res.status(400).json("Please Enter your email!")
        } else if (!password) {
            return res.status(400).json("Please Enter your password!")
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)
        })

        const savedUser = await newUser.save()

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

        res.status(201).json({ ...savedUser._doc, token })

    } catch (err) {
        res.status(400).json({ error: err.message, stack: err.stack })
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json("Please Enter your email!")
        } else if (!password) {
            return res.status(400).json("Please Enter your password!")
        }
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json("User does not exist.")
        }

        const isMatch = bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json("Inavalid Credentials")
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password
        res.status(200).json({ token, user })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const deleteAll = async (req, res) => {
    await User.deleteMany()
    res.status(200).json("deleted succesfull")
}
export const getusers = async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
}

