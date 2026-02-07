const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'audio', 'image'], default: 'text' },
    theme: { type: String, enum: ['cute', 'romantic', 'neon'], default: 'cute' },

    // Unlock Settings
    unlockMethod: { type: String, enum: ['timer', 'scratch', 'location'], default: 'timer' },
    unlockDate: { type: Date }, // For timer

    // Security & Stats
    views: { type: Number, default: 0 },
    maxViews: { type: Number, default: -1 }, // -1 = infinite
    expiresAt: { type: Date },

    // Media (Store path or URL)
    mediaUrl: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
