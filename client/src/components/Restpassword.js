import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const Restpassword = () => {
    const history = useNavigate();
    const [password,setPassword]=useState("");
    const {id,token}=useParams();
    const isValid=async()=>{
        console.log('start validaton');
        const data=await fetch(`/valid/${id}/${token}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id,token
            })
        })
        console.log('i am getting here');
        const res=await data.json();
        console.log(res);
        if(res.status==201){
            console.log('user getted');
        }
        else{
            console.log("invalid user");
            history('/*');
        }
    }

    const setPass=async(e)=>{
        const data=await fetch(`/${id}/${token}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id,token,password
            })
        })

        const res=await data.json();
        if(res.status===201){
            console.log('password updated');
            history('/');
        }
        else{
            console.log('not fund');
        }
    }

    useEffect(()=>{
        isValid();
    },[])

    const setVal=(e)=>{
        setPassword(e.target.value); 
    }
  return (
    <div>
      <div>
        <label>enter new password</label>
        <input onChange={setVal} name='password' type='password' id='password'></input>
      </div>
      <button onClick={setPass}>submit new password</button>
    </div>
  )
}

export default Restpassword
