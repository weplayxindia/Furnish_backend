const Product = require('../models/product');
const Subcategory = require('../models/subcategory');
const { uploadToCloudinary } = require('../utils/uploader');



exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, sizes, woodFinish, subcategoryId, stock } = req.body;

    
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found',
      });
    }

    
    const files = req.files.images; 
    let uploadedImages = [];
    if (files && files.length > 0) {
      for (let file of files) {
        const result = await uploadToCloudinary(file, 'products');
        uploadedImages.push({ url: result.secure_url, altText: name });
      }
    }

    
    const product = new Product({
      name,
      description,
      images: uploadedImages,
      price,
      sizes,
      woodFinish,
      subcategory: subcategoryId,
      stock,
    });

    await product.save();

    
    subcategory.products.push(product._id);
    await subcategory.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};



exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find().populate('subcategory');
  
      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No products found',
        });
      }
  
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  };
  

  
exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('subcategory');
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
  
      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product',
        error: error.message,
      });
    }
  };
  

 
exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
  
      
      const subcategory = await Subcategory.findById(product.subcategory);
      if (subcategory) {
        subcategory.products.pull(product._id);
        await subcategory.save();
      }
  
      
      await product.deleteOne();
  
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error.message,
      });
    }
  };
  