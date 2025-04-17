import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FaceLogin from './pages/FaceLogin';
import Dashboard from './pages/Dashboard';
import SetupFaceAuth from './pages/SetupFaceAuth';
import Navbar from './components/Navbar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <div className="app">
      <Navbar isAuthenticated={isAuthenticated} logout={logout} user={user} />
      <div className="container">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login login={login} />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup login={login} />} />
          <Route path="/face-login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <FaceLogin login={login} />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard user={user} updateUser={updateUser} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/setup-face-auth" 
            element={isAuthenticated ? <SetupFaceAuth user={user} updateUser={updateUser} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </div>
  );
};

export default App; 