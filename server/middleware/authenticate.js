const jwt = require("jsonwebtoken");
const userdb =require("../models/userSchema");
const keySecret="jaykumargupta";

const authenticate = async (req,res,next)=>{
    try{
        console.log('authenticate');
        const token= req.headers.authorization;
        const verifyToken = jwt.verify(token,keySecret);
        const rootuser= await userdb.findOne({_id:verifyToken._id});
        if(!rootuser) {throw new error('user not found')};

        req.token=token;
        req.rootuser=rootuser;
        req.userId=rootuser._id;

        next();
    }
    catch(error){
        res.status(401).json({status:401,message:"user not found"});
    }
}

module.exports=authenticate;