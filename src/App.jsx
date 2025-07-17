// admin_frontend/src/App.jsx


import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



import Login from './pages/Login'
import Signup from './pages/Signup';
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
