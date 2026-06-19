import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Index';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const isLoggedIn = !!token;

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isLoggedIn ? (
              <LoginPage onLogin={login} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        <Route 
          path="/" 
          element={
            isLoggedIn ? (
              <DashboardPage onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;