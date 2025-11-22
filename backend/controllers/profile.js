const Profile = require('../models/profile');
const User = require('../models/user');
const CourseProgress = require('../models/courseProgress')
const Course = require('../models/course')
const Section = require('../models/section')
const SubSection = require('../models/subSection')

const { uploadImageToCloudinary, deleteResourceFromCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration')




// ================ update Profile ================
exports.updateProfile = async (req, res) => {
    try {
        // extract data
        const { gender = '', dateOfBirth = "", about = "", contactNumber = '', firstName, lastName } = req.body;

        // extract userId
        const userId = req.user.id;


        // find profile
        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // console.log('User profileDetails -> ', profileDetails);

        // Update the profile fields
        userDetails.firstName = firstName;
        userDetails.lastName = lastName;
        await userDetails.save()

        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;

        // save data to DB
        await profileDetails.save();

        const updatedUserDetails = await User.findById(userId)
            .populate({
                path: 'additionalDetails'
            })
        // console.log('updatedUserDetails -> ', updatedUserDetails);

        // return response
        res.status(200).json({
            success: true,
            updatedUserDetails,
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        console.log('Error while updating profile');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while updating profile'
        })
    }
}


// ================ delete Account ================
exports.deleteAccount = async (req, res) => {
    try {
        // extract user id
        const userId = req.user.id;
        // console.log('userId = ', userId)

        // validation
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // delete user profile picture From Cloudinary
        await deleteResourceFromCloudinary(userDetails.image);

        // if any student delete their account && enrollded in any course then ,
        // student entrolled in particular course sholud be decreae by one
        // user - courses - studentsEnrolled
        const userEnrolledCoursesId = userDetails.courses
        console.log('userEnrolledCourses ids = ', userEnrolledCoursesId)

        for (const courseId of userEnrolledCoursesId) {
            await Course.findByIdAndUpdate(courseId, {
                $pull: { studentsEnrolled: userId }
            })
        }

        // first - delete profie (profileDetails)
        await Profile.findByIdAndDelete(userDetails.additionalDetails);

        // second - delete account
        await User.findByIdAndDelete(userId);


        // sheduale this deleting account , crone job

        // return response
        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        })
    }
    catch (error) {
        console.log('Error while updating profile');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while deleting profile'
        })
    }
}


// ================ get details of user ================
exports.getUserDetails = async (req, res) => {
    try {
        // extract userId
        const userId = req.user.id;
        console.log('id - ', userId);

        // get user details
        const userDetails = await User.findById(userId).populate('additionalDetails').exec();

        // return response
        res.status(200).json({
            success: true,
            data: userDetails,
            message: 'User data fetched successfully'
        })
    }
    catch (error) {
        console.log('Error while fetching user details');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching user details'
        })
    }
}



// ================ Update User profile Image ================
exports.updateUserProfileImage = async (req, res) => {
    try {
        const profileImage = req.files?.profileImage;
        const userId = req.user.id;

        // validation
        // console.log('profileImage = ', profileImage)

        // upload imga eto cloudinary
        const image = await uploadImageToCloudinary(profileImage,
            process.env.FOLDER_NAME, 1000, 1000);

        // console.log('image url - ', image);

        // update in DB 
        const updatedUserDetails = await User.findByIdAndUpdate(userId,
            { image: image.secure_url },
            { new: true }
        )
            .populate({
                path: 'additionalDetails'

            })

        // success response
        res.status(200).json({
            success: true,
            message: `Image Updated successfully`,
            data: updatedUserDetails,
        })
    }
    catch (error) {
        console.log('Error while updating user profile image');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while updating user profile image',
        })
    }
}




// ================ Get Enrolled Courses ================
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        let userDetails = await User.findOne({ _id: userId })
            .populate({
                path: "courses",
                populate: [
                    {
                        path: "courseContent",
                        populate: {
                            path: "subSection"
                        }
                    },
                    {
                        path: "instructor",
                        select: "firstName lastName email image"
                    },
                    {
                        path: "category",
                        select: "name description"
                    }
                ]
            })
            .exec()

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find user with id: ${userId}`,
            })
        }

        userDetails = userDetails.toObject()

        // Calculate progress for each enrolled course
        for (let i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            let SubsectionLength = 0
            
            // Calculate total duration and count subsections
            for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                const subSections = userDetails.courses[i].courseContent[j].subSection || [];
                
                totalDurationInSeconds += subSections.reduce(
                    (acc, curr) => acc + parseInt(curr.timeDuration || 0), 0
                )
                SubsectionLength += subSections.length
            }

            userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)
            userDetails.courses[i].totalLessons = SubsectionLength

            // Get user-specific course progress
            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            })

            const completedVideosLength = courseProgressCount?.completedVideos?.length || 0

            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 0
                userDetails.courses[i].progress = 0
            } else {
                // Calculate progress percentage
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                    Math.round((completedVideosLength / SubsectionLength) * 100 * multiplier) / multiplier
                userDetails.courses[i].progress = userDetails.courses[i].progressPercentage
            }
            
            // Add completed lessons count
            userDetails.courses[i].completedLessons = completedVideosLength
            userDetails.courses[i].lastAccessed = courseProgressCount?.lastAccessed || userDetails.courses[i].createdAt
        }

        // Log first course to verify data structure
        if (userDetails.courses.length > 0) {
            console.log("Sample enrolled course data:", {
                courseName: userDetails.courses[0].courseName,
                thumbnail: userDetails.courses[0].thumbnail,
                category: userDetails.courses[0].category,
                instructor: userDetails.courses[0].instructor,
                progress: userDetails.courses[0].progress
            });
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
            message: "Enrolled courses retrieved successfully"
        })
    } catch (error) {
        console.error("Error in getEnrolledCourses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve enrolled courses",
            error: error.message,
        })
    }
}




// ================ instructor Dashboard ================
exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json(
            {
                courses: courseData,
                message: 'Instructor Dashboard Data fetched successfully'
            },

        )
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}




// ================ Unenroll From Course ================
exports.unenrollFromCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        // Validate courseId
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is enrolled in the course
        if (!user.courses.includes(courseId)) {
            return res.status(400).json({
                success: false,
                message: 'You are not enrolled in this course'
            });
        }

        // Remove course from user's enrolled courses
        await User.findByIdAndUpdate(userId, {
            $pull: { courses: courseId }
        });

        // Remove user from course's enrolled students
        await Course.findByIdAndUpdate(courseId, {
            $pull: { studentsEnrolled: userId }
        });

        // Delete course progress records
        await CourseProgress.deleteMany({
            courseID: courseId,
            userId: userId
        });

        return res.status(200).json({
            success: true,
            message: 'Successfully unenrolled from course'
        });
    } catch (error) {
        console.error('Error in unenrollFromCourse:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to unenroll from course',
            error: error.message
        });
    }
};

// ================ get All Students ================
exports.getAllStudents = async (req, res) => {
    try {
        const allStudentsDetails = await User.find({
            accountType: 'Student'
        })
            .populate('additionalDetails')
            .populate('courses')
            .sort({ createdAt: -1 });


        const studentsCount = await User.countDocuments({
            accountType: 'Student'
        });


        res.status(200).json(
            {
                allStudentsDetails,
                studentsCount,
                message: 'All Students Data fetched successfully'
            },
        )
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error while fetching all students',
            error: error.message
        })
    }
}




// ================ get All Instructors ================
exports.getAllInstructors = async (req, res) => {
    try {
        const allInstructorsDetails = await User.find({
            accountType: 'Instructor'
        })
            .populate('additionalDetails')
            .populate('courses')
            .sort({ createdAt: -1 });


        const instructorsCount = await User.countDocuments({
            accountType: 'Instructor'
        });


        res.status(200).json(
            {
                allInstructorsDetails,
                instructorsCount,
                message: 'All Instructors Data fetched successfully'
            }
        )
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error while fetching all Instructors',
            error: error.message
        })
    }
}