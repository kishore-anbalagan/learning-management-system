const Course = require('../models/course');
const User = require('../models/user');
const Category = require('../models/category');
const Section = require('../models/section');
const SubSection = require('../models/subSection');
const RatingAndReview = require('../models/ratingAndReview');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, category, tags, status } = req.body;
        const instructorId = req.user.id;
        
        // Validation
        if (!courseName || !courseDescription || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }
        
        // Check if category exists
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        
        // Upload thumbnail
        let thumbnailUrl;
        try {
            const thumbnail = req.files?.thumbnail;
            if (thumbnail) {
                const uploadResult = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
                thumbnailUrl = uploadResult.secure_url;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Thumbnail is required"
                });
            }
        } catch (error) {
            console.error("Error uploading thumbnail: ", error);
            return res.status(500).json({
                success: false,
                message: "Failed to upload thumbnail",
                error: error.message
            });
        }
        
        // Create course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorId,
            whatYouWillLearn: whatYouWillLearn || "",
            price,
            category,
            thumbnail: thumbnailUrl,
            tags: tags || [],
            status: status || "Draft",
            lectures: []
        });
        
        // Add course to instructor's courses
        await User.findByIdAndUpdate(
            instructorId,
            { $push: { courses: newCourse._id } }
        );
        
        // Add course to category
        await Category.findByIdAndUpdate(
            category,
            { $push: { courses: newCourse._id } }
        );
        
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        });
        
    } catch (error) {
        console.error("Error in createCourse: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message
        });
    }
};

// Update course details
exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const updates = req.body;
        const instructorId = req.user.id;
        
        // Find course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        // Check if user is the instructor
        if (course.instructor.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this course"
            });
        }
        
        // Handle thumbnail update
        if (req.files && req.files.thumbnail) {
            const uploadResult = await uploadImageToCloudinary(
                req.files.thumbnail, 
                process.env.FOLDER_NAME
            );
            updates.thumbnail = uploadResult.secure_url;
        }
        
        // Update course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: updates },
            { new: true }
        )
        .populate('instructor', 'firstName lastName')
        .populate('category', 'name');
        
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse
        });
        
    } catch (error) {
        console.error("Error in updateCourse: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update course",
            error: error.message
        });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user.id;
        
        // Find course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        // Check if user is the instructor
        if (course.instructor.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this course"
            });
        }
        
        // Remove course from instructor's courses
        await User.findByIdAndUpdate(
            instructorId,
            { $pull: { courses: courseId } }
        );
        
        // Remove course from category
        await Category.findByIdAndUpdate(
            course.category,
            { $pull: { courses: courseId } }
        );
        
        // Remove course
        await Course.findByIdAndDelete(courseId);
        
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
        
    } catch (error) {
        console.error("Error in deleteCourse: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete course",
            error: error.message
        });
    }
};

// Get all courses (for catalog)
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: "Published" })
            .populate('instructor', 'firstName lastName')
            .populate('category', 'name')
            .select('courseName courseDescription thumbnail price category instructor averageRating');
            
        return res.status(200).json({
            success: true,
            data: courses
        });
        
    } catch (error) {
        console.error("Error in getAllCourses: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: error.message
        });
    }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        const course = await Course.findById(courseId)
            .populate('instructor', 'firstName lastName email image')
            .populate('category', 'name')
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection',
                    select: 'title description videoUrl youtubeUrl timeDuration'
                }
            })
            .populate('ratingAndReviews');
            
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            data: course
        });
        
    } catch (error) {
        console.error("Error in getCourseById: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course",
            error: error.message
        });
    }
};

// Get full course details with sections and subsections
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.query;
        
        console.log('📚 getCourseDetails called with courseId:', courseId);
        
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }
        
        const course = await Course.findById(courseId)
            .populate('instructor', 'firstName lastName email image')
            .populate('category', 'name description')
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection',
                    select: 'title description videoUrl youtubeUrl timeDuration'
                }
            })
            .populate('ratingAndReviews');
        
        console.log('📊 Course found:', {
            name: course?.courseName,
            sections: course?.courseContent?.length,
            hasVideos: course?.courseContent?.[0]?.subSection?.length > 0
        });
            
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            data: course
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

// Get courses by instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;
        
        const courses = await Course.find({ instructor: instructorId })
            .populate('category', 'name')
            .populate('studentsEnrolled', 'firstName lastName email image')
            .select('courseName courseDescription thumbnail price category status studentsEnrolled');
            
        return res.status(200).json({
            success: true,
            data: courses
        });
        
    } catch (error) {
        console.error("Error in getInstructorCourses: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch instructor courses",
            error: error.message
        });
    }
};

// Get courses by category
exports.getCoursesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        // Validate category
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        
        const courses = await Course.find({ 
            category: categoryId,
            status: "Published"
        })
        .populate('instructor', 'firstName lastName')
        .select('courseName courseDescription thumbnail price averageRating');
        
        return res.status(200).json({
            success: true,
            data: {
                category: category.name,
                courses: courses
            }
        });
        
    } catch (error) {
        console.error("Error in getCoursesByCategory: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses by category",
            error: error.message
        });
    }
};

// Add lecture to course
exports.addLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description } = req.body;
        const instructorId = req.user.id;
        
        // Validation
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        
        // Find course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        // Check if user is the instructor
        if (course.instructor.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to add lectures to this course"
            });
        }
        
        // Upload video
        let videoUrl, duration;
        try {
            const video = req.files?.video;
            if (video) {
                const uploadResult = await uploadImageToCloudinary(
                    video, 
                    process.env.FOLDER_NAME,
                    true
                );
                videoUrl = uploadResult.secure_url;
                duration = uploadResult.duration;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Video file is required"
                });
            }
        } catch (error) {
            console.error("Error uploading video: ", error);
            return res.status(500).json({
                success: false,
                message: "Failed to upload video",
                error: error.message
            });
        }
        
        // Add lecture to course
        const newLecture = {
            title,
            description,
            videoUrl,
            duration: duration || 0
        };
        
        course.lectures.push(newLecture);
        await course.save();
        
        return res.status(200).json({
            success: true,
            message: "Lecture added successfully",
            data: course.lectures[course.lectures.length - 1]
        });
        
    } catch (error) {
        console.error("Error in addLecture: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add lecture",
            error: error.message
        });
    }
};

// Update lecture
exports.updateLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { title, description } = req.body;
        const instructorId = req.user.id;
        
        // Find course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        // Check if user is the instructor
        if (course.instructor.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update lectures for this course"
            });
        }
        
        // Find lecture index
        const lectureIndex = course.lectures.findIndex(
            lecture => lecture._id.toString() === lectureId
        );
        
        if (lectureIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found"
            });
        }
        
        // Update lecture fields
        if (title) {
            course.lectures[lectureIndex].title = title;
        }
        
        if (description) {
            course.lectures[lectureIndex].description = description;
        }
        
        // Upload new video if provided
        if (req.files && req.files.video) {
            const uploadResult = await uploadImageToCloudinary(
                req.files.video, 
                process.env.FOLDER_NAME,
                true
            );
            course.lectures[lectureIndex].videoUrl = uploadResult.secure_url;
            course.lectures[lectureIndex].duration = uploadResult.duration || 0;
        }
        
        await course.save();
        
        return res.status(200).json({
            success: true,
            message: "Lecture updated successfully",
            data: course.lectures[lectureIndex]
        });
        
    } catch (error) {
        console.error("Error in updateLecture: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update lecture",
            error: error.message
        });
    }
};

// Delete lecture
exports.deleteLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const instructorId = req.user.id;
        
        // Find course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        // Check if user is the instructor
        if (course.instructor.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete lectures from this course"
            });
        }
        
        // Find lecture index
        const lectureIndex = course.lectures.findIndex(
            lecture => lecture._id.toString() === lectureId
        );
        
        if (lectureIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found"
            });
        }
        
        // Remove lecture
        course.lectures.splice(lectureIndex, 1);
        await course.save();
        
        return res.status(200).json({
            success: true,
            message: "Lecture deleted successfully"
        });
        
    } catch (error) {
        console.error("Error in deleteLecture: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete lecture",
            error: error.message
        });
    }
};