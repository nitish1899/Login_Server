import './App.css';
import Register from './components/register/register';
import ValidateOTP from './components/validateOTP/validateOTP';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={< Register />}> </Route>
          <Route path="/validateOTP" element={< ValidateOTP />}> </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
