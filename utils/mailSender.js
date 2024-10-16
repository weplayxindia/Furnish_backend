const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body, id, filePath) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        
        let mailOptions = {
            from: 'Ranbanka Furniture',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        };

    
        if (filePath) {
            mailOptions.attachments = [
                {
                    filename: `order_${id}.pdf`,
                    path: filePath,
                    contentType: 'application/pdf',
                },
            ];
        }

        console.log("Sending email with the following options:", mailOptions);

        
        let info = await transporter.sendMail(mailOptions);
        console.log(info);
        return info;

    } catch (error) {
        console.log(error.message);
    }
};

module.exports = mailSender;
