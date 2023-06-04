import './App.css';
import Register from './components/register/register';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={< Register />}> </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
