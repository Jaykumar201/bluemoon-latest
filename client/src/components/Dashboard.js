import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { loginContext } from './contextProvider/Context';

const Dashboard = () => {
    const {loginData,setLoginData}=useContext(loginContext);
    
    const history = useNavigate();

    const dashboardvalid= async()=>{
        console.log('dashboard come');
        let token = localStorage.getItem("userdatatoken");
        const data= await fetch('/validUser',{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            }
        })
        console.log('waiting for result');
        const res=await data.json();
        if(!res || res.status===401){
            console.log("user not verified");
            history("/*");
        }
        else{
            setLoginData(res);
            history("/dashboard");
            console.log("user verify");
        }
    }

    

    useEffect(()=>{
        dashboardvalid();
    },[])
  return (
    <div className='flex mx-auto border-solid border-black-500 bg-blue-500'>
        {loginData && <p>hello user 
            {loginData.validuserOne.email} 
            {loginData.validuserOne.fname}</p>}
            <p>hello user</p>

        <Link to="/header">Log out</Link>
        
    </div>
  )
}

export default Dashboard
