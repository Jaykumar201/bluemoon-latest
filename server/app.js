const express=require("express");
const app=express();
require("./db/conn")
const router=require("./routes/router")
const port=8009;
const cookieParser=require("cookie-parser");
const cors=require("cors");


app.use(express.json());
app.use(cors());
app.use(router);
app.use(cookieParser());

// app.get("/",(req,res)=>{
//     res.status(201).json("server created");
// });

app.listen(port,()=>{
    console.log(`server start at port no : ${port}`);
})