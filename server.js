require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        // Unique filename: timestamp + original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/heartlink';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---

// 1. Create a New HeartLink (Supports form-data with file)
app.post('/api/create', upload.single('media'), async (req, res) => {
    try {
        const { sender, recipient, content, theme, unlockMethod, unlockDate } = req.body;

        // Basic Validation
        if (!sender || !recipient || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newMessage = new Message({
            sender,
            recipient,
            content,
            theme,
            unlockMethod,
            unlockDate: unlockDate || null,
            mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
            type: req.file ? (req.file.mimetype.startsWith('image') ? 'image' : 'audio') : 'text'
        });

        const savedMessage = await newMessage.save();
        res.status(201).json({
            success: true,
            id: savedMessage._id,
            message: 'HeartLink created successfully!'
        });

    } catch (error) {
        console.error('Create Error:', error);
        res.status(500).json({ error: 'Server error creating message' });
    }
});

// 2. Retrieve a Message (The Reveal)
app.get('/api/message/:id', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Increment View Counter
        message.views += 1;
        await message.save();

        res.json(message);

    } catch (error) {
        res.status(500).json({ error: 'Error retrieving message' });
    }
});

// Serve Frontend (SPA Fallback)
app.get('/m/:id', (req, res) => {
    // Return the main index.html file, the frontend JS will parse the URL ID
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
