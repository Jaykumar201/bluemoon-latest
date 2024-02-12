import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const Otpverify = () => {
    const [otp,setOtp]=useState();
    const {id,token}=useParams();
    const history=useNavigate();

    const validUser=async()=>{
        console.log('here i am');
        const data=await fetch(`/validotp/${id}/${token}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id,token
            })
        })
        const res=await data.json();
        console.log(res);
        if(res.status==201){
            console.log('user verify');
        }
        else{
            console.log("invalid user");
            history('/*');
        }
    }

    const sendOtp=async()=>{
        const data=await fetch(`/send/${id}/${token}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                id,token,otp
            })
        })
        console.log('here i am');
        const res=await data.json();
        console.log('here i get result');
        console.log(res);
        if(res.status===201){
            history('/');
        }

    }

    const setVal=(e)=>{
        setOtp(e.target.value);
    }
    useEffect(()=>{
        validUser();
    },[])
  return (
    <div>
     <div>
        <label>ENter otp</label>
        <input type='name' name='name' onChange={setVal} id='name'></input>
     </div>
     <button onClick={sendOtp}>submit</button>
    </div>
  )
}

export default Otpverify
