const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
const signupSuccessTemplate = require("../mail/template/signUp");
const User = require("../models/user");
const jwt = require("jsonwebtoken")

exports.signUp = async(req, res) => {
    try {
        const {email, firstName, lastName, password, confirmPassword, role} = req.body;
        console.log("req body ", req.body)
        if(!firstName || !email || !password || !confirmPassword ){
            return res.status(403).json({
                success:false,
                message:"All field are required"
            })
        }
        
        console.log("After validations of field")
        if(password !== confirmPassword)
        {
            return res.status(400).json({
                success:false,
                message:"Enter same password in confirmation field"
            })
        }

        const userPresent = await User.findOne({email : email});
        if(userPresent){
            return res.json({
                success:false,
                message:"User is already Registered kindly go and login"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            role:role

        })

        await mailSender(email, "Sign Up Successfully", signupSuccessTemplate(firstName,email) );
        return res.status(200).json({
            success:true,
            message:"User is Registered Successfully",
            user
        })
    } catch (error) {
        console.log("error in signup ",error);

        return res.status(500).json({
            success:false,
            message:"User cannot be registered",
            error:error.message
        })
    }
}


exports.login = async(req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(404).json({
                message:"All field are required",
                success: false
            })
        }

        const existingUser = await User.findOne({email}).populate("orderHistory")
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is not registered"
            });
        }

        if (await bcrypt.compare(password, existingUser.password)) {
            
            const payload = {
                email: existingUser.email,
                id: existingUser._id,
                role : existingUser.role
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h"
            });

            existingUser.token = token
            existingUser.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                existingUser,
                message: 'logged in'
            });
        } else {
            
            return res.status(400).json({
                success: false,
                message: "Password is incorrect"
            });
        }

    } catch (error) {
        console.log("Error in login", error);
        return res.status(400).json({
            success: false,
            message: "Login failure",
            error: error.message
        });
    }
}