const orderSuccessTemplate = (name, orderID, email, totalAmount) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Your Order is Confirmed - Ranbanka Furniture!</title>
        <style>
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #333;
            }
    
            .body {
                font-size: 18px;
                margin-bottom: 20px;
                color: #666;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #009688;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999;
                margin-top: 20px;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <img class="logo" src="https://res.cloudinary.com/dre2ewshi/image/upload/v1729055857/lg_cgfrne.png" alt="Ranbanka Logo">
            <div class="message">Thank You for Your Order, ${name}!</div>
            <div class="body">
                <p>Hello ${name},</p>
                <p>We are delighted to inform you that your order <strong>#${orderID}</strong> has been successfully placed with a total amount of ₹${totalAmount}.</p>
                <p>You will receive another email once your order is shipped.</p>
                <p>We appreciate your trust in Ranbanka Furniture and look forward to serving you again!</p>
            </div>
            <a class="cta" href="href="${process.env.ORIGIN_URL}/profile">View Your Order</a>
            <div class="support">If you need any assistance, feel free to reach out to us at <a href="mailto:weplayindia.gg@gmail.com>weplayindia.gg@gmail.com</a>.</div>
        </div>
    </body>
    
    </html>`;
};

module.exports = orderSuccessTemplate;
