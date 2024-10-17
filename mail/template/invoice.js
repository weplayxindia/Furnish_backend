const generateInvoice = (reqBody, orderDetails, productName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            overflow-x:hidden
          }
          .container {
            width: 100%;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
          }
          .logo {
            width: 150px;
            margin-bottom: 10px;
          }
          .section-title {
            font-size: 18px;
            margin-bottom: 5px;
          }
          .address-block, .order-details, .product-details {
            margin-bottom: 20px;
          }
          .address-block p, .order-details p, .product-details p {
            margin: 5px 0;
          }
          .table-container {
            width: 100%;
            margin-bottom: 20px;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .invoice-table th, .invoice-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .invoice-table th {
            background-color: #f2f2f2;
          }
          .totals {
            text-align: right;
          }
          .totals p {
            margin-right: 5%;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
          }
        </style>
        <title>Invoice</title>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://res.cloudinary.com/dre2ewshi/image/upload/v1729055857/lg_cgfrne.png" alt="Logo" class="logo">
            <h1>Tax Invoice</h1>
            <p><strong>Invoice Number:</strong> RANBANKA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}</p>

            <p><strong>Order ID:</strong> ${orderDetails._id ?? 0}</p>
            <p><strong>Order Date:</strong> ${orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>

          </div>
  
          <div class="address-block">
            <div>
              <h3 class="section-title">Ship To:</h3>
              <p>${reqBody.formData.firstName ?? ''} ${reqBody.formData.lastName ?? ''}</p>
              <p>${reqBody.formData.address ?? 'N/A'}</p>
              <p>${reqBody.formData.city ?? 'N/A'}, ${reqBody.formData.state ?? 'N/A'} - ${reqBody.formData.pinCode ?? 'N/A'}, ${reqBody.formData.country ?? 'N/A'}</p>
              <p><strong>Phone:</strong> ${reqBody.formData.phoneNumber ?? 0}</p>
            </div>
  
            <div>
              <h3 class="section-title">Bill To:</h3>
              <p>${reqBody.formData.firstName ?? ''} ${reqBody.formData.lastName ?? ''}</p>
              <p>${reqBody.formData.address ?? 'N/A'}</p>
              <p>${reqBody.formData.city ?? 'N/A'}, ${reqBody.formData.state ?? 'N/A'} - ${reqBody.formData.pinCode ?? 'N/A'}, ${reqBody.formData.country ?? 'N/A'}</p>
              <p><strong>Phone:</strong> ${reqBody.formData.phoneNumber ?? 0}</p>
            </div>
          </div>
  
          <div class="order-details">
            <h3 class="section-title">Order Details:</h3>
            <p><strong>Sold By:</strong> Ranbanka Furniture</p>
            <p><strong>Ship-from Address:</strong> H-1-105, ROAD NO. 5 B, RICCO INDUSTRIAL AREA, CHURU,RAJASTHAN - 331001</p>
            
          </div>
  
          <div class="table-container">
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Gross Amount (₹)</th>
                  <th>Discount (₹)</th>
                  <th>Taxable Value (₹)</th>
                  <th>CGST (₹)</th>
                  <th>SGST (₹)</th>
                  <th>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${productName ?? 'N/A'}</td>
                  <td>${orderDetails.products?.[0]?.quantity ?? 1}</td>
                  <td>₹${orderDetails.totalAmount ?? 0}</td>
                  <td>₹0.00</td>
                  <td>₹${(orderDetails.totalAmount ?? 0) - (orderDetails.taxAmount ?? 0)}</td>
                  <td>₹${orderDetails.cgst ?? 0}</td>
                  <td>₹${orderDetails.sgst ?? 0}</td>
                  <td>₹${orderDetails.totalAmount ?? 0}</td>
                </tr>
                <tr>
                  <td>Shipping & Handling</td>
                  <td>1</td>
                  <td>₹${orderDetails.shippingCost ?? 0}</td>
                  <td>₹${orderDetails.shippingDiscount ?? 0}</td>
                  <td>₹0.00</td>
                  <td>₹0.00</td>
                  <td>₹0.00</td>
                  <td>₹${orderDetails.finalShippingCost ?? 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div class="totals">
            <p><strong>Grand Total: ₹${orderDetails.totalAmount ?? 0}</strong></p>
          </div>
  
          <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>Please keep this invoice and manufacturer box for warranty purposes.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

module.exports = generateInvoice;
