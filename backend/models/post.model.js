const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postType: {
        type: String,
        enum: ['meme', 'event', 'achivement'],
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
    date: {
        type: Date,
        required: function () {
            return this.postType === 'event';
        }
    },
    likes: {
        type: Number,
        default: 0
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
