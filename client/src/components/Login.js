import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const history=useNavigate();
    const [inpval,setInpval]=useState({
        email:'',
        password:''
    })

    const setVal=(e)=>{
        setInpval(()=>{
            const {name,value}=e.target;
            return {
                ...inpval,
                [name]:value
            }
        })
    }

    const loginUser=async(e)=>{
        e.preventDefault();
        const {email,password}=inpval;
        if(email===''){
            alert('email is invalid');
        }
        else if(password===''){
            alert('password is required');
        }
        else{
            const data=await fetch("/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email,password
                })
            });
            
            const res=await data.json();
            console.log(res);

            if(res.status===201){
                localStorage.setItem("userdatatoken",res.user.token);
                history("/dashboard");
                setInpval({...inpval,email:'',password:''});
                alert('log in successfully');
            }
            else if(res.status===422){
                alert("user not found");
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
                    <label htmlFor='email'>Email </label>
                    <input type='email' name='email' onChange={setVal} value={inpval.email} id='email'></input>
                </div>
                <div>
                    <label htmlFor='password'>Password </label>
                    <input type='password' name='password' onChange={setVal} value={inpval.password} id='password'></input>
                </div>

                <button onClick={loginUser}>log in</button>
                <p>dont have account?</p>
                <Link to='/register'>SignUP</Link>
                
            </form>
            <Link to='/send'>forget password</Link>

        </section>
    </div>
  )
}

export default Login
