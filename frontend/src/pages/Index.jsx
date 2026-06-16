import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DashboardPage({ onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-black antialiased">
      <Navbar onLogout={handleLogoutClick} />

      <main className="pt-16 flex justify-center items-center h-[calc(100vh-64px)]">
        <h1 className="text-7xl font-black tracking-tighter text-black select-none">
          Hello World
        </h1>
      </main>
    </div>
  );
}