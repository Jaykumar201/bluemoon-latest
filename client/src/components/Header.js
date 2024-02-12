import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { loginContext } from './contextProvider/Context';

const Header = () => {
  const history =useNavigate();
  const {loginData,setLoginData}=useContext(loginContext);
  const logoutUser=async()=>{
    let token = localStorage.getItem("userdatatoken");
    const data= await fetch('/logout',{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization":token,
            Accept:"application/json"
        },
        credentials:"include"
    })
    console.log('yaha aa gaya');
    const res=await data.json();
    console.log(res);
    if(res.status===201){
      console.log("user logout"); 
        let token = localStorage.removeItem("userdatatoken");
        setLoginData(false);
        history("/");
    }
    else{
      console.log('error');
      history("/*");
    }
  }
  return (
    <>
        <header>
            <nav><h1>hp cloud</h1></nav>
            <button onClick={logoutUser}>log out</button>
        </header>
    </>
  )
}

export default Header
