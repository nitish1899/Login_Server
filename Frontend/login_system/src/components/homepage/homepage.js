import React from "react"
import "./homepage.css"

const Homepage = () => {
    const clearLocalStorage = () => {
        localStorage.clear();
        window.location.href = '../login';
    }

    return (
        <div className="homepage" >
           <h1>Welcome!</h1>
            <div className="button" onClick={clearLocalStorage}>Logout</div>
        </div>
    )
}

export default Homepage