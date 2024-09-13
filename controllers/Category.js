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
        console.log("Error in login", error);
        return res.status(400).json({
            success: false,
            message: "Category creation failure",
            error: error.message
        });
    }
}