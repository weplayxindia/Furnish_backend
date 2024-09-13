const signupSuccessTemplate = (name, email) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Welcome to Friendify!</title>
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
            <img class="logo" src="#" alt="Rajwada  Logo">
            <div class="message">Welcome to Rajwada furnish, ${name}!</div>
            <div class="body">
                <p>Hello ${name},</p>
                <p>We're excited to have you on board. Your account has been successfully created with the email: <strong>${email}</strong>.</p>
                <p>You can now explore all the features of Rajwada furnish and connect with friends!</p>
            </div>
            <a class="cta" href="https://yourapp.com/login">Go to Your Account</a>
            <div class="support">If you need any assistance, feel free to reach out to us at <a href="mailto:support@friendify.com">support@friendify.com</a>.</div>
        </div>
    </body>
    
    </html>`;
};

module.exports = signupSuccessTemplate;
