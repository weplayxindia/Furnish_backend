const mongoose = require('mongoose');
const Subcategory = require('./subcategory');
const Product = require('./product');  

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory'
  }]
}, { timestamps: true });


categorySchema.pre('findOneAndDelete', async function(next) {
  try {
    const categoryId = this.getQuery()['_id'];  

    
    const subcategories = await Subcategory.find({ category: categoryId });

    
    for (let subcategory of subcategories) {
      await Product.deleteMany({ subcategory: subcategory._id }); 
    }

  
    await Subcategory.deleteMany({ category: categoryId });

    next();
  } catch (error) {
    next(error);
  }
});


const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
