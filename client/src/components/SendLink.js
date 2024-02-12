import React, { useState } from 'react'

const SendLink = (e) => {
    const [email,setEmail]=useState("");
    const sendlink=async(e)=>{
        e.preventDefault();
       const data=await fetch('/sendLink',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email
        })
       })

       
       try{
            const res=await data.json();
            console.log(res);
       }
       catch(error){
        console.log("error found after the backend");
       }
    }
    const setVal=(e)=>{
        setEmail(e.target.value);
    }
  return (
    <div>
       <div>
        <label>enter email</label>
        <input value={email} onChange={setVal} type='email' id='email' name='email'></input>
       </div>
       <button onClick={sendlink}>send link</button>
    </div>
  )
}

export default SendLink
