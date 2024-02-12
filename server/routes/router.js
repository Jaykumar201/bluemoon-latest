const express=require("express");
const router= new express.Router();
const userdb = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const usercookie =require('cookie-parser');
const authenticate =require("../middleware/authenticate");
const nodemailer= require("nodemailer");
const jwt=require("jsonwebtoken");
const keySecret="jaykumargupta";

const transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:'vishusingh314159@gmail.com',
        pass:"trto fvte dcls sxgd"
    }
})


// for register page
router.post("/register", async (req,res)=>{
    const {fname,email,password,cpassword,verified}=req.body;

    if(!fname || !email || !password || !cpassword){
        res.status(422).json({error:"fill all the detail"});
    }

    try{
        const preuser= await userdb.findOne({email:email});
        if(preuser){
            res.status(422).json({error:"email alredy exist"});
        }
        else if(password!==cpassword){
            res.status(422).json({error:"password doesn/'t match"});
        }
        else{
            const otp=`${1000+Math.floor(Math.random()*9000)}`;
            const mailOptions = {
                from:'guptajaykumar201@gmail.com',
                to: email,
                subject:"Send link for Verify user",
                text:`your otp is ${otp} expired in 5 minute`
            }
            const finalUser= new userdb({
                fname,email,password,cpassword,verified,otp
            });
            const storeData =  await finalUser.save(); 

            const token=jwt.sign({_id:storeData._id},keySecret,{
                expiresIn:"5000s",
            })
            console.log(storeData._id);
            const setuserToken = await userdb.findByIdAndUpdate({_id:storeData._id},{authToken:token},{new:true});
            const temp=storeData._id;
            const user={
                token,
                temp
            }
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log("error",error);
                    res.status(401).json({status:401,message:"email not send"});
                }
                else{
                    console.log("email sent",info.response);
                    res.status(201).json({status:201});
                }
            })
            
            res.status(201).json({status:201,user});
        }
    }
    catch(error){
        res.status(231).json({error:"catch error"});
        console.log('catch part runned');
    }
})

//for log in page

router.post('/login', async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        res.status(422).json({error:'fill all the detail'});
    }

    try{
        const validUser= await userdb.findOne({email:email});
        if(!validUser){
            res.status(422).json({status:422,message:"User not found"});
        }
        if(validUser.verified===false){
            res.status(422).json({status:422,message:"user not found"});
        }

        if(validUser){

            const ismatch= await bcrypt.compare(password,validUser.password);

            if(!ismatch){
                res.status(422).json({error:'invalid details'});
            }
            else{
               const token = await validUser.generateAuthtoken();
               res.cookie("usercookie",token,{
                expires:new Date(Date.now()+9000000),
                httpOnly:true
               });

               const user={
                validUser,
                token
               }
               res.status(201).json({status:201,user});
            }
        }
    }
    catch(error){
        res.status(401).json({status:401});
    }
})

// for dashboard page
router.get("/validUser",authenticate,async(req,res)=>{
    try{
        
        const validuserOne= await userdb.findOne({_id:req.userId});
        res.status(201).json({status:201,validuserOne});
    }
    catch(error){
        res.status(401).josn({status:401,error});
    }
})
// for logout page

router.get("/logout",authenticate,async(req,res)=>{
    try{
        req.rootuser.tokens=req.rootuser.tokens.filter((currlem)=>{
            return currlem.token!==req.token;
        })
        res.clearCookie("usercookie",{path:'/'});
        req.rootuser.save();
        res.status(201).json({status:201});
        console.log(req.rootuser.tokens);
    }
    catch(error){
        res.status(401).json({status:401});
    }
})

// sendlink page

router.post('/sendLink',async(req,res)=>{
    const {email}=req.body;
    if(!email){
        res.status(401).json({status:401,message:"please enter email"});
    }

    const user=await userdb.findOne({email:email});

    const token=jwt.sign({_id:user._id},keySecret,{
        expiresIn:"5000s",
    })

    const setuserToken = await userdb.findByIdAndUpdate({_id:user._id},{verifyToken:token},{new:true});

    if(setuserToken){
        const mailOptions = {
            from:'guptajaykumar201@gmail.com',
            to: email,
            subject:"Send link for reset password",
            text:`http://localhost:3000/forgotpassword/${user._id}/${setuserToken.verifyToken}`
        }

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log("error",error);
                res.status(401).json({status:401,message:"email not send"});
            }
            else{
                console.log("email sent",info.response);
                res.status(201).json({status:201,message:"email sent successfully"});
            }
        })
    }
})

// for resetpassword page
router.post('/valid/:id/:token',async (req,res)=>{
    console.log('here i am in the validation');
    const {id,token}=req.body;
    console.log('here i after the req');
    try{
        const validUser = await userdb.findOne({_id:id,verifyToken:token});
        console.log('user validated');
        console.log(validUser);

        const verifyToken = jwt.verify(token,keySecret);
        console.log(verifyToken);
        console.log('token validated');
        if(validUser && verifyToken._id){
            console.log('user is valid');
            res.status(201).json({status:201,message:'user is valid'});
        }
        else{
            res.status(401).json({status:401,message:'user not exist'});
        }
    }
    catch(error){
        res.status(401).json({status:401,error});
    }
})

// for resetpassword page
router.post("/:id/:token",async (req,res)=>{
    const {id,token,password}=req.body;
    try{
        console.log('i am in try');
        const validUser = await userdb.findOne({_id:id,verifyToken:token});
        console.log('user complete');

        const verifyToken = jwt.verify(token,keySecret);
        console.log('verify everything');

        if(validUser && verifyToken._id){
            const hashed=await bcrypt.hash(password,12);
            const updateuser= await userdb.findByIdAndUpdate({_id:id},{password:hashed});
            console.log("userupdated")

            const data=await updateuser.save();
            console.log("user save");
            res.status(201).json({status:201,message:'user is valid'});
        }
        else{
            res.status(401).json({status:401,message:'user not exist'});
        }
        console.log('yes user is valid');
    }
    catch(error){
        res.status(401).json({status:401,error});
        console.log('error capturing');
    }
})

// for otpverify
router.post('/send/:id/:token',async(req,res)=>{
    console.log('jay');
    const {id,token,otp}=req.body;
    console.log('yes i am waiting here');

    try{
        console.log('i am inside verify otp')
        const user=await userdb.findOne({_id:id,authToken:token});

        const verifyToken = jwt.verify(token,keySecret);
        console.log('verify everything');
        console.log('user find');
        console.log(otp===user.otp);
        console.log(user.otp);
        console.log(otp);
        if(user && verifyToken._id && otp===user.otp){
            const data=await userdb.findByIdAndUpdate({_id:id},{verified:true},{new:true});
            await data.save();
            console.log('user otp save');
            res.status(201).json({status:201,message:"user verifed"});
            console.log(data);
        }
        
    }
    catch(error){
        res.status(401).json({status:401,message:'YES THERE IS ERROR'});
    }


})

// for otpverify
router.post('/validotp/:id/:token',async (req,res)=>{
    console.log('here i am in the validation');
    const {id,token}=req.body;
    console.log('here i after the req');
    try{
        const validUser = await userdb.findOne({_id:id,authToken:token});
        console.log('user validated');
        console.log(validUser);

        const verifyToken = jwt.verify(token,keySecret);
        console.log(verifyToken);
        console.log('token validated');
        if(validUser && verifyToken._id){
            console.log('user is valid');
            res.status(201).json({status:201,message:'user is valid'});
        }
        else{
            res.status(401).json({status:401,message:'user not exist'});
        }
    }
    catch(error){
        res.status(401).json({status:401,error});
    }
})


module.exports=router;