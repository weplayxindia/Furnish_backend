const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['customer', 'admin'], 
    default: 'customer'
  },
  token : {
    type: String
  },
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work'],
      required: true
    },
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  }],
  phoneNumber: {
    type: String,
    required: true
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;

