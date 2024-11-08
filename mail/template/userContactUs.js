const usercontactUsTemplate = (name, email, message) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Contact Us - Ranbanka Furniture</title>
        <style>
            body {
                background-color: #f9f9f9;
                font-family: 'Arial', sans-serif;
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
                text-align: center;
            }
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
            .message {
                font-size: 26px;
                font-weight: bold;
                color: #4A4A4A;
                margin-bottom: 20px;
            }
            .body {
                font-size: 18px;
                line-height: 1.6;
                color: #555;
                margin-bottom: 20px;
                text-align: left;
            }
            .highlight {
                background-color: #e6f7ff;
                padding: 10px;
                border-left: 4px solid #007bff;
                border-radius: 5px;
                margin: 15px 0;
            }
            .footer {
                font-size: 14px;
                color: #888;
                margin-top: 30px;
            }
            .support {
                margin-top: 20px;
                font-weight: bold;
            }
            .cta-button {
                display: inline-block;
                padding: 10px 15px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
            .cta-button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img class="logo" src="https://res.cloudinary.com/dre2ewshi/image/upload/v1731060721/Untitled-1sssa_menbom.png" alt="Ranbanka Logo">
            <div class="message">Thank You for Contacting Us, ${name}!</div>
            <div class="body">
                <p>Hello ${name},</p>
                <p>We appreciate you reaching out to us! Your message has been received, and our team is eager to assist you.</p>
                <div class="highlight">
                    <strong>Your Message:</strong><br>
                    "${message}"
                </div>
                <p>If you have any further details or questions, feel free to reach us directly at <a href="mailto:${process.env.ADMIN_MAIL}">${process.env.ADMIN_MAIL}</a>.</p>
            </div>
            <div class="footer">
                <p class="support">For immediate assistance, please contact our support team at <a href="mailto:weplayindia.gg@gmail.com">weplayindia.gg@gmail.com</a>.</p>
                <p>We look forward to connecting with you!</p>
                <a href="mailto:${process.env.ADMIN_MAIL}" class="cta-button">Reply to Us</a>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = usercontactUsTemplate;
