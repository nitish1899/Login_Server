import './App.css';
import Register from './components/register/register';
import ValidateOTP from './components/validateOTP/validateOTP';
import Login from './components/login/login';
import Homepage from './components/homepage/homepage';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={< Register />}> </Route>
          <Route path="/validateOTP" element={< ValidateOTP />}> </Route>
          <Route path="/login" element={< Login />}> </Route>
          <Route exact path="/homepage" element={< Homepage />}> </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
