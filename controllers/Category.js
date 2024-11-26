const Category = require("../models/category");


exports.createCategory = async(req,res) => {
    try {
        const {name, description} = req.body;
        if(!name) {
            return res.status(400).json({
                message:"Category filed are important",
                success:false
            })
        }

        const existingCategory  = await Category({name: name});
        if(!existingCategory)
        {
            return  res.status(400).json({
                succesL:false,
                message:"This category is already available"
            })
        }

        const newCategory = new Category({
            name: name
        })

        await newCategory.save();

        return res.status(200).json({
            message:"Category created successfully",
            success:true
        })
    } catch (error) {
        console.log("Error in creating category", error);
        return res.status(400).json({
            success: false,
            message: "Category creation failure",
            error: error.message
        });
    }
}


exports.getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find()
        .populate({
            path: "subcategories",
            options: { sort: { arrangement: 1 } },
            populate: {
                path: "products"
            }
        })
        
            .exec();

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                message: "No category found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Categories fetched successfully",
            success: true,
            categories: categories
        });
    } catch (error) {
        console.log("Error in fetching categories", error);
        return res.status(400).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};



exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id)
            .populate({
                path: "subcategories",
                populate: {
                    path: "products"
                }
            })
            .exec();

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Category fetched successfully",
            success: true,
            category: category
        });
    } catch (error) {
        console.log("Error in fetching category by ID", error);
        return res.status(400).json({
            success: false,
            message: "Failed to fetch category",
            error: error.message
        });
    }
};



exports.deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Category deleted successfully",
            success: true
        });
    } catch (error) {
        console.log("Error in deleting category by ID", error);
        return res.status(400).json({
            success: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};
