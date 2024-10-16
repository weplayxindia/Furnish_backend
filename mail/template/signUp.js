const signupSuccessTemplate = (name, email) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Ranbanka Furniture</title>
    <style>
        body {
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
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
            color: white;
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
        <div class="message">Welcome to Ranbanka Furniture, ${name}!</div>
        <div class="body">
            <p>Hello ${name},</p>
            <p>Thank you for joining Ranbanka Furniture! Your account has been created with the email: <strong>${email}</strong>.</p>
            <p>Explore our stylish and affordable furniture to enhance your home. We have something for everyone!</p>
            <p>Get started today and enjoy a seamless shopping experience.</p>
        </div>
        <a class="cta" href="${process.env.ORIGIN_URL}/login">Go to Your Account</a>
        <div class="support">
            If you need assistance, feel free to reach out to us at <a href="mailto:weplayindia.gg@gmail.com">weplayindia.gg@gmail.com</a>.
        </div>
    </div>
</body>
</html>`;
};

module.exports = signupSuccessTemplate;
