const contactUsAdminTemplate = (name, email, message) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Contact Us Message - Ranbanka Furniture</title>
        <style>
            body {
                background-color: #f9f9f9;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 30px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .header img {
                max-width: 150px;
            }
            .header h1 {
                font-size: 26px;
                color: #3e3e3e;
            }
            .body {
                font-size: 18px;
                line-height: 1.6;
                color: #444;
            }
            .footer {
                font-size: 14px;
                color: #888;
                text-align: center;
                margin-top: 30px;
            }
            .contact-info {
                font-weight: bold;
                margin-bottom: 10px;
            }
            .message-content {
                background-color: #f0f8ff;
                padding: 15px;
                border-left: 4px solid #007bff;
                border-radius: 5px;
                font-size: 16px;
                color: #333;
                margin-top: 15px;
            }
            .call-to-action {
                margin-top: 30px;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .call-to-action:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://res.cloudinary.com/dre2ewshi/image/upload/v1729055857/lg_cgfrne.png" alt="Ranbanka Furniture Logo" />
                <h1>New Contact Us Message</h1>
            </div>
            <div class="body">
                <p class="contact-info">You've received a new message from:</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Message:</strong></p>
                <div class="message-content">
                    <p>${message}</p>
                </div>
            </div>
            <div class="footer">
                <p>You can respond to this message by replying to <a href="mailto:${email}">${email}</a>.</p>
                <p>Thank you for your attention!</p>
                <a href="mailto:${email}" class="call-to-action">Reply to Sender</a>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = contactUsAdminTemplate;
