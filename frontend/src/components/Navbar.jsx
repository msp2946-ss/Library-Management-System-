import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold flex items-center">
              📚 Library Management
            </Link>
            
            {user && (
              <div className="hidden md:flex space-x-6">
                <Link to="/" className="hover:text-blue-200 transition">
                  Dashboard
                </Link>
                <Link to="/books" className="hover:text-blue-200 transition">
                  Books
                </Link>
                <Link to="/members" className="hover:text-blue-200 transition">
                  Members
                </Link>
                <Link to="/issues" className="hover:text-blue-200 transition">
                  Issue/Return
                </Link>
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <span className="font-medium">{user.name}</span>
                <span className="ml-2 px-3 py-1 bg-blue-700 rounded-full text-xs uppercase">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
