const express = require('express');
const router = express.Router();

const { auth, isInstructor, isStudent } = require('../middleware/auth');
// Dashboard controller imports (ensure these exist in ../controllers/dashboard.js)
const {
    getStudentDashboard,
    getDashboardInfo,
    markLectureCompleted,
    enrollInCourse,
    getCourseDetails,
    getInstructorDashboard,
    sendEncouragement
} = require('../controllers/dashboard');

// -------------------- General / Shared --------------------
router.get('/', auth, getDashboardInfo);
router.get('/course/:courseId', auth, getCourseDetails);

// -------------------- Student Routes ----------------------
router.get('/student', auth, isStudent, getStudentDashboard);
router.post('/enroll', auth, isStudent, enrollInCourse);
router.post('/mark-complete', auth, isStudent, markLectureCompleted);
// (Removed) Learning data route placeholder was referencing undefined controller getCourseLearningData.
// If needed later, implement controller then restore route:
// router.get('/course/:courseId/learn', auth, isStudent, getCourseLearningData);

// Available courses for enrollment
router.get('/courses/available', auth, isStudent, async (req, res) => {
    try {
        const userId = req.user.id;
        const Course = require('../models/course');
        const availableCourses = await Course.find({
            status: 'Published',
            studentsEnrolled: { $ne: userId }
        })
            .populate('instructor', 'firstName lastName')
            .populate('category', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: availableCourses, message: 'Available courses retrieved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: 'Error retrieving available courses' });
    }
});

// -------------------- Instructor Routes ------------------
router.get('/instructor', auth, isInstructor, getInstructorDashboard);
router.get('/instructor/students', auth, isInstructor, async (req, res) => {
    try {
        const instructorId = req.user.id;
        const Course = require('../models/course');
        const courses = await Course.find({ instructor: instructorId })
            .populate('studentsEnrolled', 'firstName lastName email image')
            .populate('ratingAndReviews')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: courses, message: 'Enrolled students retrieved successfully' });
    } catch (error) {
        console.log('Error getting enrolled students:', error);
        res.status(500).json({ success: false, error: error.message, message: 'Error retrieving enrolled students' });
    }
});

// Encouragement message route (choose correct controller name)
router.post('/encourage', auth, isInstructor, sendEncouragement);

module.exports = router;