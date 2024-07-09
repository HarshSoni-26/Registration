const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const upload = multer();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/resgitrationdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, age, gender } = req.body;

        // Server-side validation
        if (!firstName || !lastName || !email || !phone || !password || !age || !gender) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered.' });
        }

        // Create a new user
        const newUser = new User({ firstName, lastName, email, phone, password, age, gender });

        await newUser.save();
        res.status(200).json({ success: true, message: 'Registration successful.' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
