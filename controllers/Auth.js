const bcrypt = require("bcrypt");

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

        })
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