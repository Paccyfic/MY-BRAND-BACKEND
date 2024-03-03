import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        trim: true,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export const Comment = mongoose.model('Comment', commentSchema);
