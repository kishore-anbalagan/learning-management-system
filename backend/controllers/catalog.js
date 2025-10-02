const Category = require('../models/category');
const Course = require('../models/course');
const User = require('../models/user');
const mongoose = require('mongoose');

// ================ Get Catalog Page Data ================
exports.getCatalogPageData = async (req, res) => {
    try {
        const { categoryId } = req.body;
        
        // Find the category by ID or name
        let selectedCategory;
        
        if (mongoose.Types.ObjectId.isValid(categoryId)) {
            // If categoryId is a valid ObjectId, search by ID
            selectedCategory = await Category.findById(categoryId)
                .populate({
                    path: "courses",
                    match: { status: "Published" },
                    populate: [
                        {
                            path: "instructor",
                            select: "firstName lastName"
                        },
                        {
                            path: "ratingAndReviews",
                        }
                    ]
                })
                .exec();
        } else {
            // If not a valid ObjectId, search by name
            selectedCategory = await Category.findOne({ name: { $regex: new RegExp(categoryId, 'i') } })
                .populate({
                    path: "courses",
                    match: { status: "Published" },
                    populate: [
                        {
                            path: "instructor",
                            select: "firstName lastName"
                        },
                        {
                            path: "ratingAndReviews",
                        }
                    ]
                })
                .exec();
        }

        // Handle the case when the category is not found
        if (!selectedCategory) {
            return res.status(404).json({ 
                success: false, 
                message: "Category not found" 
            });
        }

        // Get top-selling courses across all categories (limit to 10)
        const topSellingCourses = await Course.find({ status: "Published" })
            .sort({ studentsEnrolled: -1 })
            .limit(10)
            .populate("instructor", "firstName lastName")
            .populate("ratingAndReviews")
            .exec();

        // Get most popular categories (those with the most courses)
        const mostPopularCategories = await Category.aggregate([
            {
                $project: {
                    name: 1,
                    description: 1,
                    courseCount: { $size: "$courses" }
                }
            },
            { $sort: { courseCount: -1 } },
            { $limit: 5 }
        ]);

        // Return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                topSellingCourses,
                mostPopularCategories
            }
        });
    } catch (error) {
        console.log("Error in getCatalogPageData: ", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching catalog page data",
            error: error.message
        });
    }
};