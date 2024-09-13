const jwt = require("jsonwebtoken");
require("dotenv").config();





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

exports.isAdmin = async(req, res, next) => {
    console.log("Req body", req.user)
    try {
        console.log("Req body", req.user)
        if(req.user.role !== "admin"){
            return res.status(401).json({
                success: false,
                message : "This is protected route valid only for Admin"
            })
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message : "Error : user verification failed",
            error : error.message
        })
    }
}