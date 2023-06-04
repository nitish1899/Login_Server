import React, { useState } from "react"
import "./login.css"
import axios from "axios"

const Login = () => {
   
    const [user, setUser] = useState({
        email:"",
    })

    const handleChange = e => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const login =async () => {
        const { email } = user
        if( email ) {
            try{
                const response = await axios.post("http://localhost:5000/user/login", {email} );
                console.log(response.data.data);
                localStorage.setItem('otpFor', 'signin');
                localStorage.setItem('userId',`${response.data.data.userId}`);
                window.location.href = '../validateOTP'
            } catch (error) {
               console.log(error.message);
            } 
        } else {
            alert('Invalid email entered')
        }
    }

    return (
        <div id="log">
           <div className="login">
            <input type="text" name="email" value={user.email} onChange={ handleChange } placeholder="Enter your Email"></input>
            <div className="button" onClick={login}>Get OTP</div>
           </div>
            <div className="title">
                <p>Don't have an account ? <a href= "../register">Sign Up</a></p>
                <h1>Login</h1> 
            </div>
         
        </div>
    )
}

export default Login