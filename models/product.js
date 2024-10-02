const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  length: {type : Number},
  width : {type : Number},
  height : {type : Number},
  colore: {type : String},
  warranty:{type : Number},
  assembly: {type : String},
  amazon_flipkart_price : {type : Number},
  description: {
    type: String,
    // required: true
  },
  images: [{
    url: {
      type: String,
      // required: true
    },
    altText: {
      type: String,
      default: ''
    }
  }],
  price: {
    type: Number,
    required: true
  },
  sizes: [{
    size: String, 
    dimensions: String 
  }],
  woodFinish: [{
    type: String,
  }],
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  },
  stock: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
