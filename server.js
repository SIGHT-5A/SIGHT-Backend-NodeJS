// imports
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const generateRandomColor = require('./Utils/GenerateRandomColor');
const generateRandomId = require('./Utils/GenerateRandomId');
dotenv.config();

// environment variables
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

// middleware and configs
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const dbConnection = mongoose.connection;

dbConnection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

dbConnection.once('open', () => {
    console.log('Connected to MongoDB Atlas');

    // Start the server after MongoDB is connected
    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
    });
});



// routes
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist." });
        }

        const isMatch = password === user.password;
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }
        // If login is successful, return the user data
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists!!!' });
        }

        const avatarBg = generateRandomColor();

        const avatarColor = generateRandomColor();
        const avatarId = generateRandomId();

        // Create a new user document
        const newUser = new User({
            email,
            password,
            NotificationChannel: email,
            avatarBg,
            avatarColor,
            avatarId
        });

        // Save the user to the database
        await newUser.save().then(
            res.status(201).json({ message: 'User created successfully' })
        );

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});