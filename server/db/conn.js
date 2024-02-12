const mongoose=require("mongoose");
const DB="mongodb+srv://guptajay201:8f53DtcbKyxLyHzI@cluster0.fnl6zni.mongodb.net/authen?retryWrites=true&w=majority";
mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log('database connected')).catch((errr)=>{
    console.log(errr);
});