const pdf = require('html-pdf');
const fs = require('fs');
const generateInvoice = require('../mail/template/invoice');

 const createPDF = (reqBody, orderDetails, productName) => {
    
    const htmlContent = generateInvoice(reqBody, orderDetails, productName)
  
    
    const filePath = `./invoices/order_${orderDetails._id}.pdf`;
  
    
    return new Promise((resolve, reject) => {
      pdf.create(htmlContent).toFile(filePath, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(filePath);
        }
      });
    });
  };

  module.exports = createPDF;