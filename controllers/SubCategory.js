const Subcategory = require('../models/subcategory');
const Category = require('../models/category');


exports.createSubcategory = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;

    
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    
    const subcategory = new Subcategory({ name, description, category: categoryId });
    await subcategory.save();

    
    category.subcategories.push(subcategory._id);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      subcategory,
    });
  } catch (error) {
    console.error('Error creating subcategory', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subcategory',
      error: error.message,
    });
  }
};


exports.getAllSubcategories = async (req, res) => {
    try {
      const subcategories = await Subcategory.find().populate('category').populate("products");
  
      if (!subcategories || subcategories.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No subcategories found',
        });
      }
  
      res.status(200).json({
        success: true,
        subcategories,
      });
    } catch (error) {
      console.error('Error fetching subcategories', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subcategories',
        error: error.message,
      });
    }
  };
  

exports.getSubcategoryById = async (req, res) => {
    try {
      const subcategory = await Subcategory.findById(req.params.id).populate('category').populate("products");
  
      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: 'Subcategory not found',
        });
      }
  
      res.status(200).json({
        success: true,
        subcategory,
      });
    } catch (error) {
      console.error('Error fetching subcategory', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subcategory',
        error: error.message,
      });
    }
  };
  

  
exports.deleteSubcategory = async (req, res) => {
    try {
      const subcategory = await Subcategory.findById(req.params.id);
  
      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: 'Subcategory not found',
        });
      }
  
     
      const category = await Category.findById(subcategory.category);
      category.subcategories.pull(subcategory._id);
      await category.save();
  
      
      await subcategory.deleteOne();
  
      res.status(200).json({
        success: true,
        message: 'Subcategory deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting subcategory', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete subcategory',
        error: error.message,
      });
    }}  