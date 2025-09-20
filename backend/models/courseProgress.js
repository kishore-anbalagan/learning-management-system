const mongoose = require("mongoose")

const courseProgressSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
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
        default: 0
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("CourseProgress", courseProgressSchema)

