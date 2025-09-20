const User = require('../models/user');
const Course = require('../models/course');
const CourseProgress = require('../models/courseProgress');
const mongoose = require('mongoose');

// ================= GET DASHBOARD INFO =================
exports.getDashboardInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const accountType = req.user.accountType;

        const user = await User.findById(userId).populate({
            path: 'courses',
            select: 'courseName courseDescription thumbnail instructor price category',
            populate: [
                { path: 'instructor', select: 'firstName lastName' },
                { path: 'category', select: 'name' }
            ]
        });

        if (accountType === 'Student') {
            return await exports.getStudentDashboard(req, res);
        } else if (accountType === 'Instructor') {
            return await exports.getInstructorDashboard(req, res);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid account type'
            });
        }
    } catch (error) {
        console.log('Error while fetching dashboard info:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching dashboard info'
        });
    }
};

// ================= GET STUDENT DASHBOARD =================
exports.getStudentDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate({
            path: 'courses',
            select: 'courseName courseDescription thumbnail price category',
            populate: [
                { path: 'instructor', select: 'firstName lastName' },
                { path: 'category', select: 'name' },
                {
                    path: 'courseContent',
                    populate: { path: 'subSection' }
                }
            ]
        });

        const enrolledCoursesWithProgress = await Promise.all(
            user.courses.map(async (course) => {
                const progress = await CourseProgress.findOne({
                    courseID: course._id,
                    userId: userId
                });

                let totalVideos = 0;
                if (course.courseContent && course.courseContent.length > 0) {
                    for (const section of course.courseContent) {
                        if (section.subSection && section.subSection.length > 0) {
                            totalVideos += section.subSection.length;
                        }
                    }
                }

                return {
                    ...course.toObject(),
                    progress: progress ? progress.completedVideos.length : 0,
                    totalVideos
                };
            })
        );

        const availableCourses = await Course.find({
            _id: { $nin: user.courses },
            status: 'Published'
        })
            .populate('instructor', 'firstName lastName')
            .populate('category', 'name')
            .populate('ratingAndReviews')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: {
                enrolledCourses: enrolledCoursesWithProgress,
                availableCourses,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    accountType: user.accountType,
                    image: user.image
                }
            },
            message: 'Student dashboard data retrieved successfully'
        });
    } catch (error) {
        console.error("Error in getStudentDashboard: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student dashboard data",
            error: error.message
        });
    }
};

// ================= GET INSTRUCTOR DASHBOARD =================
exports.getInstructorDashboard = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const instructorCourses = await Course.find({ instructor: instructorId })
            .populate('studentsEnrolled', 'firstName lastName email')
            .populate('category', 'name')
            .populate('ratingAndReviews')
            .sort({ createdAt: -1 });

        const coursesWithStats = instructorCourses.map(course => {
            const enrollmentCount = course.studentsEnrolled.length;
            const averageRating = course.ratingAndReviews.length > 0
                ? course.ratingAndReviews.reduce((sum, review) => sum + review.rating, 0) / course.ratingAndReviews.length
                : 0;

            return {
                ...course.toObject(),
                enrollmentCount,
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews: course.ratingAndReviews.length
            };
        });

        const totalStudents = new Set(
            instructorCourses.flatMap(course =>
                course.studentsEnrolled.map(student => student._id.toString())
            )
        ).size;

        const totalCourses = instructorCourses.length;
        const totalEnrollments = instructorCourses.reduce(
            (sum, course) => sum + course.studentsEnrolled.length, 0
        );

        return res.status(200).json({
            success: true,
            data: {
                courses: coursesWithStats,
                stats: {
                    totalStudents,
                    totalCourses,
                    totalEnrollments
                }
            },
            message: 'Instructor dashboard data retrieved successfully'
        });
    } catch (error) {
        console.error("Error in getInstructorDashboard: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch instructor dashboard data",
            error: error.message
        });
    }
};

// ================= ENROLL STUDENT IN COURSE =================
exports.enrollInCourse = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if (course.status !== 'Published') {
            return res.status(400).json({
                success: false,
                message: "Course is not available for enrollment"
            });
        }

        const user = await User.findById(userId);
        if (user.courses.includes(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Already enrolled in this course"
            });
        }

        session.startTransaction();

        await User.findByIdAndUpdate(
            userId,
            { $push: { courses: courseId } },
            { session }
        );

        await Course.findByIdAndUpdate(
            courseId,
            { $push: { studentsEnrolled: userId } },
            { session }
        );

        await CourseProgress.create(
            [{
                courseId: courseId,
                userId: userId,
                progress: 0,
                completedLectures: []
            }],
            { session }
        );

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Successfully enrolled in course"
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error in enrollInCourse: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to enroll in course",
            error: error.message
        });
    } finally {
        session.endSession();
    }
};

// ================= GET COURSE DETAILS =================
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const course = await Course.findById(courseId)
            .populate('instructor', 'firstName lastName email image')
            .populate('category', 'name');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const user = await User.findById(userId);
        const isEnrolled = user.courses.includes(courseId);

        if (!isEnrolled && course.instructor._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course"
            });
        }

        let progress = null;
        if (isEnrolled) {
            progress = await CourseProgress.findOne({ courseId: courseId, userId: userId });
        }

        return res.status(200).json({
            success: true,
            data: {
                course,
                progress: progress || { completedVideos: [] }
            },
            message: 'Course details retrieved successfully'
        });
    } catch (error) {
        console.error("Error in getCourseDetails: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course details",
            error: error.message
        });
    }
};

// ================= MARK LECTURE COMPLETED =================
exports.markLectureCompleted = async (req, res) => {
    try {
        const { courseId, lectureId } = req.body;
        const userId = req.user.id;

        if (!courseId || !lectureId) {
            return res.status(400).json({
                success: false,
                message: "Course ID and lecture ID are required"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const lectureExists = course.lectures.some(
            lecture => lecture._id.toString() === lectureId
        );
        if (!lectureExists) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found in course"
            });
        }

        let progress = await CourseProgress.findOne({ courseId: courseId, userId: userId });
        if (!progress) {
            progress = await CourseProgress.create({
                courseId: courseId,
                userId: userId,
                completedLectures: []
            });
        }

        const isCompleted = progress.completedLectures.some(l => l.lectureId === lectureId);
        if (isCompleted) {
            return res.status(400).json({
                success: false,
                message: "Lecture already marked as completed"
            });
        }

        progress.completedLectures.push({
            lectureId: lectureId,
            completedAt: new Date()
        });

        progress.progress = (progress.completedLectures.length / course.lectures.length) * 100;
        progress.lastAccessed = new Date();
        await progress.save();

        return res.status(200).json({
            success: true,
            message: "Lecture marked as completed",
            data: {
                progress: progress.progress,
                completedLectures: progress.completedLectures
            }
        });
    } catch (error) {
        console.error("Error in markLectureCompleted: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark lecture as completed",
            error: error.message
        });
    }
};

// ================= SEND ENCOURAGEMENT =================
exports.sendEncouragement = async (req, res) => {
    try {
        const { courseId, message, studentIds } = req.body;
        const instructorId = req.user.id;

        if (!courseId || !message) {
            return res.status(400).json({
                success: false,
                message: "Course ID and message are required"
            });
        }

        const course = await Course.findOne({ _id: courseId, instructor: instructorId });
        if (!course) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to send messages for this course"
            });
        }

        let targetStudentIds = studentIds || course.studentsEnrolled;
        const students = await User.find(
            { _id: { $in: targetStudentIds } },
            'firstName lastName email'
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No students found"
            });
        }

        // For now just simulate sending
        return res.status(200).json({
            success: true,
            message: "Encouragement messages sent successfully",
            data: {
                sentTo: students.length,
                students: students.map(student => ({
                    name: `${student.firstName} ${student.lastName}`,
                    email: student.email
                }))
            }
        });
    } catch (error) {
        console.error("Error in sendEncouragement: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send encouragement messages",
            error: error.message
        });
    }
};
