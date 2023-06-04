import React, { useState } from "react"
import "./validateOTP.css"
import axios from "axios"

const ValidateOTP = () => {
   
    const [user, setUser] = useState({
        otp:"",
    })

    const handleChange = e => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const verifyOTP = async () => {
        const { otp } = user
        const userId =  localStorage.getItem('userId');
        console.log(otp)
        if( otp ) {
            const response = await axios.post("http://localhost:5000/user/verifyOTP",{userId, otp} );
            //console.log(response.data)
            alert('SignUp Successful');
            window.location.href = '../login';   
        } else {
            alert('Invalid otp entered')
        }   
    }

    return (
        <div id="validate">
           <div className="verify">
            <input type="text" name="otp" value={user.otp} onChange={ handleChange } placeholder="Enter OTP"></input>
            <div className="button" onClick={verifyOTP}>Validate</div>
           </div>
            <div className="title">
                <h1>Validate Your OTP</h1> 
            </div>
        </div>
    )
}

export default ValidateOTP