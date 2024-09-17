const mongoose = require('mongoose');


const CustomerSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    phone1: { type: String, required: true },
    phone2: { type: String, required: false },
    email: { type: String, required: true },
    subscriptionDate: { type: Date, required: false },
    website: { type: String, required: false }
});


const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
