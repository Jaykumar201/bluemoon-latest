import { set } from 'mongoose';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const history=useNavigate();
    const [inpval,setInpval]=useState({
        fname:"",
        email:"",
        password:"",
        cpassword:""
    })
    console.log(inpval);

    const setVal=(e)=>{
       const {name,value}=e.target;
       setInpval(()=>{
        return {
            ...inpval,
            [name]:value
        }
       })
    }

    const addUser=async(e)=>{
        e.preventDefault();

        const {fname,email,password,cpassword}=inpval;
        const verified=false;
        if(fname===''){
            alert("enter your name");
        }
        else if(email===''){
            alert('enter your gmail');
        }
        else if(password==='' || password<6){
            alert('enter your password');
        }
        else if(password!=cpassword){
            alert('password doesn\'t match');
        }
        else{
            const data=await fetch("/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    fname,email,password,cpassword,verified
                })
            })
             
            const res=await data.json();
            console.log(res.status);
            if(res.status===201){
                console.log(res);
                alert('registration succesfully');
                history(`/verifyOtp/${res.user.temp}/${res.user.token}`)
                setInpval({...inpval,fname:'',email:'',password:'',cpassword:''});
            }
        }
    }
  return (
    <div>
        <section>
            <div>
                <h1> welecome back log in</h1>
                <p>hi, we are glad you are back</p>
            </div>

            <form action=''>
            <div>
                    <label htmlFor='fname'>Name</label>
                    <input type='fname' onChange={setVal} name='fname'value={inpval.fname} id='fname'></input>
                </div>
                <div>
                    <label htmlFor='email'>Email </label>
                    <input type='email' onChange={setVal} name='email' value={inpval.email} id='email'></input>
                </div>
                <div>
                    <label htmlFor='password'>enter otp</label>
                    <input type='password'  onChange={setVal} name='cpassword' value={inpval.cpassword} id='cpassword'></input> 
                </div>
                <div>
                    <label htmlFor='password'>Password </label>
                    <input type='password' onChange={setVal} name='password' value={inpval.password} id='password'></input>
                </div>
                <div>
                    <label htmlFor='password'>confirm Password </label>
                    <input type='password'  onChange={setVal} name='cpassword' value={inpval.cpassword} id='cpassword'></input> 
                </div>
                <button onClick={addUser}>Register</button>
                <p>dont have account? sign up</p>
            </form>

        </section>
    </div>
  )
}

export default Register;
