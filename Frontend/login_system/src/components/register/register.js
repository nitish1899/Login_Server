import React, {useState} from "react"
import "./register.css"
import axios from "axios"
const Register = () => {

    const [user, setUser] = useState({
        name:"",
        email:"",
        password:""
    })

    const handleChange = e => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const register = async () => {
        const { name,email,password } = user

        if ( email && name && password) {
            try{
                const response = await axios.post("http://localhost:5000/user/signup", user );
                console.log(response.data);
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
        <div id="reg">
            <div className="register">
                <input type="text" name="name" value={user.name} placeholder=" Your Name" onChange={ handleChange }></input>
                <input type="text" name="email" value={user.email} placeholder=" Your Email"  onChange={ handleChange }></input>
                <input type="password" name="password" value={user.password} placeholder="Your Password"  onChange={ handleChange }></input>
                <div className="button" onClick={register}>Get OTP</div>
            </div>
            <div className="title">
                <p>Have an account ? <a href= "../login">Sign in</a></p>
                <h1>Create an account</h1> 
            </div>
        </div>
    )
}

export default Register