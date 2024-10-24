const contactUsAdminTemplate = require("../mail/template/adminContactUs");
const userContactUsTemplate = require("../mail/template/userContactUs");
const mailSender = require("../utils/mailSender");

exports.contactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        
        if (!name || !email || !message) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

    
        await mailSender(email, "Mail sent successfully", userContactUsTemplate(name, email, message));

    
        await mailSender(process.env.ADMIN_MAIL, "Received contact us mail - Ranbanka Furniture", contactUsAdminTemplate(name, email, message));

        return res.status(200).json({
            message: "Your message has been sent successfully",
            success: true
        });

    } catch (error) {
        console.error("Error in contactUs function:", error);

        
        return res.status(500).json({
            message: "An error occurred while sending the message. Please try again later.",
            success: false
        });
    }
};
