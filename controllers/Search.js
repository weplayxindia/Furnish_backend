const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Product = require('../models/product');


exports.searchAll = async (req, res) => {
  try {
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    
    const searchCategories = await Category.find({
      name: { $regex: searchQuery, $options: 'i' }, 
    });

    
    const searchSubcategories = await Subcategory.find({
      name: { $regex: searchQuery, $options: 'i' },
    });

    
    const searchProducts = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ],
    }).populate('subcategory');

    
    return res.status(200).json({
      success: true,
      searchCategories,
      searchSubcategories,
      searchProducts,
    });
  } catch (error) {
    console.error('Error in searchAll:', error);
    return res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    });
  }
};
