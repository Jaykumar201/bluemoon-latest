const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const keySecret="jaykumargupta";



const userSchema= new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new error("email doesn't exist  ");
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    cpassword:{
        type:String,
        required:true,
        minlength:6,
    },
    tokens:[
        {
            token:{
                type:String,
                required:false,
            }
        }
    ],
    verifyToken:{
        type:String
    },
    verified:{
        type:Boolean,
    },
    otp:{
        type:String,
    },
    authToken:{
        type:String,
    }
})

//creating model



userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password,12);
        this.cpassword= await bcrypt.hash(this.cpassword,12);
    }
    

    next()
})

userSchema.methods.generateAuthtoken = async function(){
    try{
        let token_gen = jwt.sign({_id:this._id},keySecret,{
            expiresIn:"1d"
        })
        this.tokens = this.tokens.concat({token:token_gen});
        await this.save();
        return token_gen;
    }
    catch(error){
        res.status(422).json({error:"not genraterd"});
    }
}

const userdb = new mongoose.model("users",userSchema);


module.exports=userdb;