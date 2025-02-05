const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postType: {
        type: String,
        enum: ['meme', 'event', 'achievement'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postImages: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        required: function () {
            return this.postType === 'event';
        }
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: [
        {
            text: String,
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);