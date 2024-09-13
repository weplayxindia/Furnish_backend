const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
    totalAmount: {
      type: Number,
      required: true
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
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  },
 
   { timestamps: true }

);
  

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;