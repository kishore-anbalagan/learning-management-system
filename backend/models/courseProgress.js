const mongoose = require("mongoose")

const courseProgressSchema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    completedVideos: [
        {
            type: String,
            required: true
        }
    ],
    completedLectures: [
        {
            lectureId: {
                type: String,
                required: true
            },
            completedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

// Compound index to ensure one progress record per user per course
courseProgressSchema.index({ courseID: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("CourseProgress", courseProgressSchema)

