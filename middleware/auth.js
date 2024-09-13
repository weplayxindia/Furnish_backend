const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../modals/User");



exports.auth = async (req, res,next) => {
    console.log("Request Headers:", req.headers);

 try {
    

    
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
    console.log("token", token)
    
    if(!token) {
        return res.status(401).json({
            success:false,
            message:"Token is missing"
        })
    }

    console.log("checking token")
    console.log("req body ", req.body )
    

    try {
        const decode =  jwt.verify(token,process.env.JWT_SECRET);
        console.log("Decoded token ", decode);
        req.user = decode;
        console.log("request user data ", req.user);
    } catch (error) {
        

        return res.status(401).json({
            success:false,
            message:"token is invalid"
        })
    }
    next();
 } catch (error) {
    console.log("Error in auth ", error)
    return res.status(401).json({
        success:false,
        message: 'Someting went wrong while validating the token',
        error: error.message
    })
 }
}