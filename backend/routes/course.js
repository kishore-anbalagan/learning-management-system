const express = require('express');
const router = express.Router();
const { auth, isInstructor } = require('../middleware/auth');
const {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getCourseById,
    getCourseDetails,
    getInstructorCourses,
    getCoursesByCategory,
    addLecture,
    updateLecture,
    deleteLecture
} = require('../controllers/course');

// Public routes
router.get('/all', getAllCourses);
router.get('/get/:courseId', getCourseById);
router.get('/getCourseDetails', getCourseDetails);
router.get('/category/:categoryId', getCoursesByCategory);

// Instructor routes
router.post('/create', auth, isInstructor, createCourse);
router.put('/update/:courseId', auth, isInstructor, updateCourse);
router.delete('/delete/:courseId', auth, isInstructor, deleteCourse);
router.get('/instructor', auth, isInstructor, getInstructorCourses);

// Lecture routes
router.post('/:courseId/lecture', auth, isInstructor, addLecture);
router.put('/:courseId/lecture/:lectureId', auth, isInstructor, updateLecture);
router.delete('/:courseId/lecture/:lectureId', auth, isInstructor, deleteLecture);

module.exports = router;