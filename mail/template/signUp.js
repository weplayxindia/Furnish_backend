const signupSuccessTemplate = (name, email) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Welcome to Rajwada Furnish!</title>
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
            <img class="logo" src="https://www.rajwadafurnish.com/cdn/shop/files/Logo_PNG_Black-01_e4b638af-2761-41a5-89ef-e99167857488.png?v=1711971257&width=460" alt="Rajwada Logo">
            <div class="message">Welcome to Rajwada Furnish, ${name}!</div>
            <div class="body">
                <p>Hello ${name},</p>
                <p>Thank you for joining Rajwada Furnish, your go-to destination for exquisite furniture! Your account has been successfully created with the email: <strong>${email}</strong>.</p>
                <p>Explore our wide range of stylish and affordable furniture to enhance your home. From elegant sofas to chic dining sets, we have something for everyone!</p>
                <p>Get started today and enjoy a seamless shopping experience.</p>
            </div>
            <a class="cta" href="https://yourapp.com/login">Go to Your Account</a>
            <div class="support">If you need any assistance, feel free to reach out to us at <a href="mailto:support@rajwadafurnish.com">support@rajwadafurnish.com</a>.</div>
        </div>
    </body>
    
    </html>`;
};

module.exports = signupSuccessTemplate;
